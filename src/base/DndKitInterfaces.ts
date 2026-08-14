import type { Active, DraggableAttributes, Over } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { MutableRefObject } from "react";
import type { Transform } from "@dnd-kit/utilities";
import type { ClientRect } from "@dnd-kit/core";

export interface DndKitDroppable {
  active: Active | null;
  rect: MutableRefObject<ClientRect | null>;
  readonly isOver: boolean;
  readonly node: { current: HTMLElement | null };
  readonly over: Over | null;
  readonly setNodeRef: (element: HTMLElement | null) => void;
}

export interface DraggableState {
  readonly active: Active | null;
  readonly activatorEvent: Event | null;
  readonly activeNodeRect: ClientRect | null;
  readonly over: Over | null;
  readonly isDragging: boolean;
}

export interface DraggableRefs {
  readonly node: { current: HTMLElement | null };
  readonly setNodeRef: (element: HTMLElement | null) => void;
  readonly setActivatorNodeRef: (element: HTMLElement | null) => void;
}

export interface DraggableRender {
  readonly attributes: DraggableAttributes;
  readonly listeners: SyntheticListenerMap | undefined;
  transform: Transform | null;
}

export type DndKitDraggable = DraggableState & DraggableRefs & DraggableRender;
