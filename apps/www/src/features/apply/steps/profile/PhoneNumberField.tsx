"use client";

import { useState } from "react";

import { TextField } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

import type { ProfileFormValues } from "./schemas";

export function PhoneNumberField() {
  const { control } = useFormContext<ProfileFormValues>();
  const {
    field: { ref, name, value, onBlur, onChange },
    fieldState,
  } = useController({ name: "phoneNumber", control });
  const [hasInvalidInput, setHasInvalidInput] = useState(false);

  const error = value ? fieldState.error : undefined;

  return (
    <TextField status={error || hasInvalidInput ? "error" : "default"}>
      <TextField.Label>휴대폰 번호</TextField.Label>
      <TextField.Input
        ref={ref}
        name={name}
        required
        type="tel"
        inputMode="numeric"
        maxLength={11}
        autoComplete="tel-national"
        placeholder="01012345678"
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          const nextValue = event.target.value.replace(/\D/g, "");

          setHasInvalidInput(nextValue !== event.target.value);
          onChange(nextValue);
        }}
      />
      <TextField.Footer>
        <TextField.Helper>{error?.message ?? "'-' 없이 숫자만 입력해주세요."}</TextField.Helper>
      </TextField.Footer>
    </TextField>
  );
}
