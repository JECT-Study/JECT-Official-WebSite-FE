"use client";

import { CheckboxGroup, type CheckboxOption, Link as JdsLink } from "@jects/jds";
import { Controller, useFormContext } from "react-hook-form";

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

export function TermsField() {
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
