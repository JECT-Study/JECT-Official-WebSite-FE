"use client";

import { BlockButton } from "@jects/jds";
import { useFormContext, useFormState } from "react-hook-form";

interface StepSubmitButtonProps {
  disabled: boolean;
}

export function StepSubmitButton({ disabled }: StepSubmitButtonProps) {
  const { control } = useFormContext();
  const { isValid } = useFormState({ control });

  return (
    <BlockButton
      type="submit"
      hierarchy="accent"
      size="md"
      suffixIcon="arrow-right"
      className="self-start"
      disabled={disabled || !isValid}
    >
      다음 단계로 진행하기
    </BlockButton>
  );
}
