"use client";

import type { ReactNode } from "react";

import { TextField, type TextFieldProps } from "@jects/jds";

interface TextFieldWithButtonProps extends Omit<TextFieldProps, "children"> {
  label: ReactNode;
  button: ReactNode;
  footer?: ReactNode;
  /** `TextField.Input`을 전달한다. */
  children: ReactNode;
}

export function TextFieldWithButton({
  label,
  button,
  footer,
  children,
  ...fieldProps
}: TextFieldWithButtonProps) {
  return (
    <TextField {...fieldProps}>
      <TextField.Label>{label}</TextField.Label>
      {/* 푸터가 입력 상자의 형제가 아니면 JDS 간격이 적용되지 않으므로 직접 지정해야 한다. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-12 gap-y-6">
        {children}
        {button}
        {footer && <TextField.Footer>{footer}</TextField.Footer>}
      </div>
    </TextField>
  );
}
