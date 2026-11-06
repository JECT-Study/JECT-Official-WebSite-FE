"use client";

import { useState } from "react";

import { TextField } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

import { MAX_NAME_LENGTH, type ProfileFormValues, removeNonKorean } from "./schemas";

export function NameField() {
  const { control } = useFormContext<ProfileFormValues>();
  const {
    field: { ref, name, value, onBlur, onChange },
    fieldState,
  } = useController({ name: "name", control });
  const [hasInvalidInput, setHasInvalidInput] = useState(false);

  const error = value ? fieldState.error : undefined;

  return (
    <TextField status={error || hasInvalidInput ? "error" : "default"}>
      <TextField.Label>이름</TextField.Label>
      <TextField.Input
        ref={ref}
        name={name}
        required
        maxLength={MAX_NAME_LENGTH}
        autoComplete="name"
        placeholder="김젝트"
        value={value}
        onBlur={onBlur}
        onChange={(event) => {
          const nextValue = removeNonKorean(event.target.value);

          setHasInvalidInput(nextValue !== event.target.value);
          onChange(nextValue);
        }}
      />
      <TextField.Footer>
        <TextField.Helper>
          {error && !hasInvalidInput ? error.message : "한글만 입력할 수 있어요."}
        </TextField.Helper>
        <TextField.Counter />
      </TextField.Footer>
    </TextField>
  );
}
