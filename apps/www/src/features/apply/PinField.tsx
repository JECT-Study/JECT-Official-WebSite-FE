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
}

export function PinField({ label, placeholder, autoComplete }: PinFieldProps) {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const { control, trigger } = useFormContext<PinFormValues>();
  const {
    field: { ref, name, value, onBlur, onChange },
    fieldState,
  } = useController({ name: "pin", control });

  return (
    <TextField status={fieldState.error ? "error" : "default"}>
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

          if (!fieldState.isTouched) {
            void trigger("pin");
          }
        }}
      />
      {fieldState.error && (
        <TextField.Footer>
          <TextField.Helper>{fieldState.error.message}</TextField.Helper>
        </TextField.Footer>
      )}
    </TextField>
  );
}
