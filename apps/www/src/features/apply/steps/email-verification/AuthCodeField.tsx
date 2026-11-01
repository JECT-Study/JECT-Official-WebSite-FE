"use client";

import { BlockButton, TextField, type TextFieldProps } from "@jects/jds";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

import { FieldTimer } from "@/components/common/field-timer";
import { TextFieldWithButton } from "@/components/common/text-field-with-button";

import { authCodeSchema, type EmailVerificationFormValues } from "./schemas";

export type AuthCodeStatus = "idle" | "pending" | "verified" | "expired" | "mismatch";

interface AuthCodeFeedback {
  status: TextFieldProps["status"];
  helper: string;
}

const AUTH_CODE_FEEDBACK: Record<AuthCodeStatus, AuthCodeFeedback> = {
  idle: { status: "default", helper: "유효 시간 내에 입력해주세요." },
  pending: { status: "default", helper: "유효 시간 내에 입력해주세요." },
  verified: { status: "success", helper: "인증에 성공했습니다." },
  expired: { status: "error", helper: "유효 시간이 만료되었습니다." },
  mismatch: { status: "error", helper: "인증번호가 올바르지 않습니다." },
};

interface AuthCodeFieldProps {
  deadline: number;
  validSeconds: number;
  status: AuthCodeStatus;
  onVerify: () => void;
  onChange: () => void;
}

export function AuthCodeField({
  deadline,
  validSeconds,
  status,
  onVerify,
  onChange,
}: AuthCodeFieldProps) {
  const { control, register } = useFormContext<EmailVerificationFormValues>();
  const authCode = useWatch({ control, name: "authCode" });
  const { errors } = useFormState({ control, name: "authCode" });

  const error = authCode ? errors.authCode : undefined;
  const isVerified = status === "verified";
  const canVerify = status === "idle" || status === "mismatch";
  const isVerifyDisabled = !authCodeSchema.safeParse(authCode).success || !canVerify;

  const feedback: AuthCodeFeedback =
    status === "idle" && error?.message
      ? { status: "error", helper: error.message }
      : AUTH_CODE_FEEDBACK[status];

  return (
    <TextFieldWithButton
      label="인증번호"
      status={feedback.status}
      readonly={isVerified}
      button={
        <BlockButton
          type="button"
          hierarchy="primary"
          size="md"
          disabled={isVerifyDisabled}
          onClick={onVerify}
        >
          인증하기
        </BlockButton>
      }
      footer={
        <>
          <TextField.Helper>{feedback.helper}</TextField.Helper>
          {!isVerified && (
            <FieldTimer
              key={deadline}
              deadline={deadline}
              totalSeconds={validSeconds}
              isError={feedback.status === "error"}
            />
          )}
        </>
      }
    >
      <TextField.Input
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="인증번호를 입력해주세요"
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) {
            return;
          }

          event.preventDefault();

          if (!isVerifyDisabled) {
            onVerify();
          }
        }}
        {...register("authCode", { onChange })}
      />
    </TextFieldWithButton>
  );
}
