from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path


class OpenCodeCommandError(RuntimeError):
    def __init__(self, returncode: int, stderr: str) -> None:
        self.returncode = returncode
        self.stderr = stderr
        super().__init__(f"opencode run exited {returncode}: {stderr.strip()}")


def run(impl_clone: Path, prompt: str, *, timeout: int = 900) -> str:
    """Write `prompt` to a temp .md file and invoke opencode against it,
    mirroring dotharness's own trick (its backend.py) of passing "Read {tmp}
    and follow the instructions exactly." rather than a large blob on the
    command line — sidesteps shell-arg-length limits. Returns opencode's
    stdout.

    Real invocation confirmed live on this machine: `opencode run [message]
    --pure --dir <path>`. `--dangerously-skip-permissions` does NOT exist in
    the installed version — never pass it, despite dotharness's own backend
    and the planning docs referencing it.
    """
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".md", prefix="orchestrate_", delete=False
    ) as tmp:
        tmp.write(prompt)
        tmp_path = Path(tmp.name)
    try:
        message = f"Read {tmp_path} and follow the instructions exactly."
        result = subprocess.run(
            ["opencode", "run", message, "--pure", "--dir", str(impl_clone)],
            capture_output=True,
            text=True,
            check=False,
            timeout=timeout,
        )
    finally:
        tmp_path.unlink(missing_ok=True)

    if result.returncode != 0:
        raise OpenCodeCommandError(result.returncode, result.stderr)
    return result.stdout
