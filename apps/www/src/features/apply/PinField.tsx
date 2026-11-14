"use client";

import { useState } from "react";

import { IconButton, TextField } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

interface PinFormValues {
  pin: string;
}

interface PinFieldProps {
  label: string;
  placeholder: string;
  autoComplete: "new-password" | "current-password";
  errorMessage?: string;
  onChange?: () => void;
}

export function PinField({
  label,
  placeholder,
  autoComplete,
  errorMessage,
  onChange: onPinChange,
}: PinFieldProps) {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const { control, trigger } = useFormContext<PinFormValues>();
  const {
    field: { ref, name, value, onBlur, onChange },
    fieldState,
  } = useController({ name: "pin", control });

  const helper = errorMessage ?? fieldState.error?.message;

  return (
    <TextField status={helper ? "error" : "default"}>
      <TextField.Label>{label}</TextField.Label>
      <TextField.Input
        ref={ref}
        name={name}
        type={isPinVisible ? "text" : "password"}
        inputMode="numeric"
        maxLength={6}
        autoComplete={autoComplete}
        placeholder={placeholder}
        suffix={
          <IconButton
            type="button"
            icon={isPinVisible ? "eye" : "eye-off"}
            hierarchy="tertiary"
            size="sm"
            aria-label={isPinVisible ? "PIN 숨기기" : "PIN 보기"}
            onClick={() => setIsPinVisible((visible) => !visible)}
          />
        }
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          onChange(event.target.value.replace(/\D/g, ""));
          onPinChange?.();

          if (!fieldState.isTouched) {
            void trigger("pin");
          }
        }}
      />
      {helper && (
        <TextField.Footer>
          <TextField.Helper>{helper}</TextField.Helper>
        </TextField.Footer>
      )}
    </TextField>
  );
}
