"use client";

import { TextField } from "@jects/jds";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import type { IdentityVerificationFormValues } from "./schemas";

interface EmailFieldProps {
  isMismatch: boolean;
  onChange: () => void;
}

export function EmailField({ isMismatch, onChange }: EmailFieldProps) {
  const { control, register } = useFormContext<IdentityVerificationFormValues>();
  const email = useWatch({ control, name: "email" });
  const { errors } = useFormState({ control, name: "email" });

  const error = email ? errors.email : undefined;

  return (
    <TextField status={error || isMismatch ? "error" : "default"}>
      <TextField.Label>이메일</TextField.Label>
      <TextField.Input
        type="email"
        autoComplete="email"
        placeholder="itclubject@ject.kr"
        {...register("email", { onChange })}
      />
      {error && (
        <TextField.Footer>
          <TextField.Helper>{error.message}</TextField.Helper>
        </TextField.Footer>
      )}
    </TextField>
  );
}
