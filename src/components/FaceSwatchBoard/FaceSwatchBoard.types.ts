import type { DragEndEvent } from "@dnd-kit/core";

export type FaceTileId = string & { readonly brand: unique symbol };

export function createFaceTileId(raw: string): FaceTileId {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    throw new TypeError("FaceTileId must not be empty");
  }
  return trimmed as FaceTileId;
}

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

export type FaceSwatchBoardViewModel = FaceSwatchBoardTiles &
  FaceSwatchBoardDropState &
  FaceSwatchBoardActions;

export class FaceSwatchBoardViewModelImpl implements FaceSwatchBoardViewModel {
  public readonly trayTiles: ReadonlyArray<FaceTile>;
  public readonly slotTile: FaceTile | null;
  public readonly droppableRef: (element: HTMLElement | null) => void;
  public readonly isOver: boolean;
  public readonly canDropActive: boolean;
  public readonly onDragEnd: (event: DragEndEvent) => void;
  public readonly onReturnTile: () => void;

  private constructor(
    trayTiles: ReadonlyArray<FaceTile>,
    slotTile: FaceTile | null,
    droppableRef: (element: HTMLElement | null) => void,
    isOver: boolean,
    canDropActive: boolean,
    onDragEnd: (event: DragEndEvent) => void,
    onReturnTile: () => void,
  ) {
    this.trayTiles = trayTiles;
    this.slotTile = slotTile;
    this.droppableRef = droppableRef;
    this.isOver = isOver;
    this.canDropActive = canDropActive;
    this.onDragEnd = onDragEnd;
    this.onReturnTile = onReturnTile;
  }

  static create(config: {
    trayTiles: ReadonlyArray<FaceTile>;
    slotTile: FaceTile | null;
    droppableRef: (element: HTMLElement | null) => void;
    isOver: boolean;
    canDropActive: boolean;
    readonly onDragEnd: (event: DragEndEvent) => void;
    readonly onReturnTile: () => void;
  }): FaceSwatchBoardViewModel {
    const {
      trayTiles,
      slotTile,
      droppableRef,
      isOver,
      canDropActive,
      onDragEnd,
      onReturnTile,
    } = config;

    if (!Array.isArray(trayTiles)) {
      throw new TypeError("trayTiles must be an array");
    }

    for (const tile of trayTiles) {
      if (!tile?.id || typeof tile.imageSrc !== "string") {
        throw new TypeError("Each trayTile must have a valid id and imageSrc");
      }
    }

    if (
      slotTile !== null &&
      (!slotTile.id || typeof slotTile.imageSrc !== "string")
    ) {
      throw new TypeError("slotTile must have a valid id and imageSrc");
    }

    if (typeof droppableRef !== "function") {
      throw new TypeError("droppableRef must be a function");
    }

    if (typeof onDragEnd !== "function") {
      throw new TypeError("onDragEnd must be a function");
    }

    if (typeof onReturnTile !== "function") {
      throw new TypeError("onReturnTile must be a function");
    }

    return new FaceSwatchBoardViewModelImpl(
      trayTiles,
      slotTile,
      droppableRef,
      Boolean(isOver),
      Boolean(canDropActive),
      onDragEnd,
      onReturnTile,
    );
  }
}
