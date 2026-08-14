import type { Meta, StoryObj } from "@storybook/react-vite";
import { useStoryTelescope } from "../../base/useStoryTelescope";
import { FaceSwatchBoard } from "./FaceSwatchBoard";
import type { FaceSwatchBoardState, FaceTileId } from "./FaceSwatchBoard.types";

function FaceSwatchBoardHost(
  props: Readonly<FaceSwatchBoardState>,
): React.ReactElement {
  const { state, telescope } = useStoryTelescope<FaceSwatchBoardState>(props);

  return <FaceSwatchBoard state={state} telescope={telescope} />;
}

const meta = {
  title: "Fractal Pattern/FaceSwatchBoard (split-hook tier)",
  component: FaceSwatchBoardHost,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FaceSwatchBoardHost>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    trayTileIds: ["h0e0m0" as FaceTileId, "h0e1m2" as FaceTileId, "h1e0m1" as FaceTileId, "h2e2m0" as FaceTileId],
    slotTileId: null,
  },
};

export const SlotFilled: StoryObj<typeof meta> = {
  args: {
    trayTileIds: ["h0e0m0" as FaceTileId, "h0e1m2" as FaceTileId, "h1e0m1" as FaceTileId],
    slotTileId: "h2e2m0" as FaceTileId,
  },
};
