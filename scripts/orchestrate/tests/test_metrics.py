import json
from pathlib import Path

from orchestrate import metrics
from orchestrate.models import PhaseMetrics


def _metrics(**overrides) -> PhaseMetrics:
    base = dict(track="baseline", phase_number=1, phase_name="domain-core")
    base.update(overrides)
    return PhaseMetrics(**base)


def test_load_all_returns_empty_list_when_file_missing(tmp_path: Path) -> None:
    assert metrics.load_all(tmp_path / "experiment-log.json") == []


def test_load_all_round_trips(tmp_path: Path) -> None:
    log = tmp_path / "experiment-log.json"
    log.write_text(
        json.dumps([_metrics().model_dump(mode="json")]),
        encoding="utf-8",
    )

    loaded = metrics.load_all(log)

    assert len(loaded) == 1
    assert loaded[0].phase_number == 1
    assert loaded[0].track == "baseline"


def test_render_writes_markdown_table(tmp_path: Path) -> None:
    log = tmp_path / "experiment-log.json"
    log.write_text(
        json.dumps(
            [
                _metrics(
                    pr_number=7,
                    sonar_issues_opened=3,
                    sonar_issues_resolved=2,
                    sonar_issues_left_open=1,
                    manual_test_first_try_pass=True,
                ).model_dump(mode="json")
            ]
        ),
        encoding="utf-8",
    )
    md = tmp_path / "experiment-log.md"

    metrics.render(log, md)

    text = md.read_text(encoding="utf-8")
    assert "# Experiment log" in text
    assert "#7" in text
    assert "3/2/1" in text
    assert "pass" in text


def test_render_handles_empty_log(tmp_path: Path) -> None:
    log = tmp_path / "experiment-log.json"
    md = tmp_path / "experiment-log.md"

    metrics.render(log, md)

    assert "# Experiment log" in md.read_text(encoding="utf-8")


def test_append_and_commit_resyncs_writes_and_pushes(mocker, tmp_path: Path) -> None:
    review_clone = tmp_path / "review-clone"
    review_clone.mkdir()
    log = review_clone / "docs" / "experiment-log.json"
    md = review_clone / "docs" / "experiment-log.md"

    fetch_resync = mocker.patch("orchestrate.metrics.git_ops.fetch_resync")
    commit_all = mocker.patch("orchestrate.metrics.git_ops.commit_all", return_value=True)
    fast_forward_push = mocker.patch("orchestrate.metrics.git_ops.fast_forward_push")

    metrics.append_and_commit(review_clone, log, md, _metrics(phase_number=2))

    fetch_resync.assert_called_once_with(review_clone, "main")
    assert log.exists()
    loaded = metrics.load_all(log)
    assert len(loaded) == 1
    assert loaded[0].phase_number == 2
    assert md.exists()
    commit_all.assert_called_once()
    fast_forward_push.assert_called_once_with(review_clone, "main")


def test_append_and_commit_skips_push_when_nothing_to_commit(mocker, tmp_path: Path) -> None:
    review_clone = tmp_path / "review-clone"
    review_clone.mkdir()
    log = review_clone / "docs" / "experiment-log.json"
    md = review_clone / "docs" / "experiment-log.md"

    mocker.patch("orchestrate.metrics.git_ops.fetch_resync")
    mocker.patch("orchestrate.metrics.git_ops.commit_all", return_value=False)
    fast_forward_push = mocker.patch("orchestrate.metrics.git_ops.fast_forward_push")

    metrics.append_and_commit(review_clone, log, md, _metrics())

    fast_forward_push.assert_not_called()


def test_append_and_commit_accumulates_across_calls(mocker, tmp_path: Path) -> None:
    review_clone = tmp_path / "review-clone"
    review_clone.mkdir()
    log = review_clone / "docs" / "experiment-log.json"
    md = review_clone / "docs" / "experiment-log.md"

    mocker.patch("orchestrate.metrics.git_ops.fetch_resync")
    mocker.patch("orchestrate.metrics.git_ops.commit_all", return_value=True)
    mocker.patch("orchestrate.metrics.git_ops.fast_forward_push")

    metrics.append_and_commit(review_clone, log, md, _metrics(phase_number=1))
    metrics.append_and_commit(review_clone, log, md, _metrics(phase_number=2))

    loaded = metrics.load_all(log)
    assert [m.phase_number for m in loaded] == [1, 2]
