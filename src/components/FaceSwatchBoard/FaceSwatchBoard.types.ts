import type { DragEndEvent } from "@dnd-kit/core";

export type FaceTileId = string & { readonly brand: unique symbol };

export interface FaceSwatchBoardState {
  readonly trayTileIds: ReadonlyArray<FaceTileId>;
  readonly slotTileId: FaceTileId | null;
}

export interface FaceTile {
  readonly id: FaceTileId;
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
