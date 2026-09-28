import { createContext } from "react";

interface DragHandleContextValue {
  handleRef: (element: Element | null) => void;
}

export const DragHandleContext = createContext<DragHandleContextValue | null>(null);
