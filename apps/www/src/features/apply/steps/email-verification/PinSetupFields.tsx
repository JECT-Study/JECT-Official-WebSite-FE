"use client";

import { useState } from "react";

import {
  CheckboxGroup,
  type CheckboxOption,
  IconButton,
  Link as JdsLink,
  TextField,
} from "@jects/jds";
import { Controller, useController, useFormContext } from "react-hook-form";

import { EXTERNAL_LINKS } from "@/constants/links";

import { type EmailVerificationFormValues, REQUIRED_TERMS } from "./schemas";

interface Term extends CheckboxOption {
  value: (typeof REQUIRED_TERMS)[number];
}

const TERMS: Term[] = [
  {
    value: "privacy",
    label: (
      <span>
        [필수] 젝트{" "}
        <JdsLink href={EXTERNAL_LINKS.applyPrivacyPolicy} target="_blank" rel="noopener noreferrer">
          개인정보 수집 및 이용
        </JdsLink>
        에 동의합니다.
      </span>
    ),
  },
  {
    value: "paymentPolicy",
    label: (
      <span>
        [필수]{" "}
        <JdsLink href={EXTERNAL_LINKS.paymentPolicy} target="_blank" rel="noopener noreferrer">
          회비 및 보증금 납입 정책
        </JdsLink>
        에 동의합니다.
      </span>
    ),
  },
];

function PinField() {
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

function TermsField() {
  const { control } = useFormContext<EmailVerificationFormValues>();

  return (
    <Controller
      name="agreedTerms"
      control={control}
      render={({ field }) => (
        <CheckboxGroup
          size="md"
          variant="hollow"
          aria-label="약관 동의"
          options={TERMS}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}

export function PinSetupFields() {
  return (
    <>
      <PinField />
      <TermsField />
    </>
  );
}
