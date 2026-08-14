import type { DragEndEvent } from "@dnd-kit/core";

export interface FaceSwatchBoardState {
  readonly trayTileIds: ReadonlyArray<string>;
  readonly slotTileId: string | null;
}

export interface FaceTile {
  readonly id: string;
  readonly imageSrc: string;
}

export interface FaceSwatchBoardTiles {
  readonly trayTiles: ReadonlyArray<FaceTile>;
  readonly slotTile: FaceTile | null;
}

export interface FaceSwatchBoardDropState {
  readonly droppableRef: (element: HTMLElement | null) => void;
  readonly isOver: boolean;
  readonly canDropActive: boolean;
}

export interface FaceSwatchBoardActions {
  readonly onDragEnd: (event: DragEndEvent) => void;
  readonly onReturnTile: () => void;
}

export type FaceSwatchBoardViewModel =
  & FaceSwatchBoardTiles
  & FaceSwatchBoardDropState
  & FaceSwatchBoardActions;
