"use client";

import { BlockButton, TextField } from "@jects/jds";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { TextFieldWithButton } from "@/components/common/text-field-with-button";
import { type EmailAuthFormValues, emailSchema } from "@/features/apply/schemas";

interface EmailFieldProps {
  isVerified: boolean;
  coolingDownEmail: string | null;
  isPending: boolean;
  errorMessage?: string;
  onSend: () => void;
}

export function EmailField({
  isVerified,
  coolingDownEmail,
  isPending,
  errorMessage,
  onSend,
}: EmailFieldProps) {
  const { control, register } = useFormContext<EmailAuthFormValues>();
  const email = useWatch({ control, name: "email" });
  const { errors } = useFormState({ control, name: "email" });

  const helper = errorMessage ?? (email ? errors.email?.message : undefined);
  const isSendDisabled =
    !emailSchema.safeParse(email).success || isVerified || email === coolingDownEmail || isPending;

  return (
    <TextFieldWithButton
      label="이메일"
      status={helper ? "error" : "default"}
      readonly={isVerified}
      button={
        <BlockButton
          type="button"
          hierarchy="primary"
          size="md"
          disabled={isSendDisabled}
          onClick={onSend}
        >
          인증번호 받기
        </BlockButton>
      }
      footer={helper && <TextField.Helper>{helper}</TextField.Helper>}
    >
      <TextField.Input
        type="email"
        autoComplete="email"
        placeholder="itclubject@ject.kr"
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) {
            return;
          }

          event.preventDefault();

          if (!isSendDisabled) {
            onSend();
          }
        }}
        {...register("email")}
      />
    </TextFieldWithButton>
  );
}
