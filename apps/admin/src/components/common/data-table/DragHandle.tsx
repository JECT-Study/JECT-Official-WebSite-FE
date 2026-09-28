import { useContext } from "react";

import { IconButton } from "@jects/jds";

import { DragHandleContext } from "./DraggableRow.context";

// IconButton의 hierarchy에는 assistive 색이 없어 accent의 색 지정 기능으로 적용한다.
const HANDLE_COLOR = { normal: "var(--color-semantic-object-assistive)" };

interface DragHandleProps {
  label: string;
}

export function DragHandle({ label }: DragHandleProps) {
  const context = useContext(DragHandleContext);
  if (!context) throw new Error("DragHandle은 DraggableRow 안에서만 사용할 수 있습니다.");
  const { handleRef } = context;

  return (
    <IconButton
      ref={handleRef}
      size="lg"
      icon="grip-vertical"
      hierarchy="accent"
      accentColor={HANDLE_COLOR}
      className="cursor-grab"
      aria-label={label}
    />
  );
}
