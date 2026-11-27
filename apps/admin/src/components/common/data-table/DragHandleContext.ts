import { createContext } from "react";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

interface DragHandleContextValue {
  handleRef: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

export const DragHandleContext = createContext<DragHandleContextValue | null>(null);
