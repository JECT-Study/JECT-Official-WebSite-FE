"use client";

import { useState } from "react";

import { IconButton, TextField } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

import type { EmailVerificationFormValues } from "./schemas";

export function PinField() {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const { control, trigger } = useFormContext<EmailVerificationFormValues>();
  const {
    field: { ref, name, value, onBlur, onChange },
    fieldState,
  } = useController({ name: "pin", control });

  return (
    <TextField status={fieldState.error ? "error" : "default"}>
      <TextField.Label>PIN 설정</TextField.Label>
      <TextField.Input
        ref={ref}
        name={name}
        type={isPinVisible ? "text" : "password"}
        inputMode="numeric"
        maxLength={6}
        autoComplete="new-password"
        placeholder="6자리 숫자를 입력해주세요"
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
