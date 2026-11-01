"use client";

import { useId } from "react";

import { CheckboxGroup } from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { visuallyHidden } from "@jects/jds/utils";
import { useController, useFormContext } from "react-hook-form";

import { INTERESTED_DOMAIN_OPTIONS } from "./options";
import { MAX_INTERESTED_DOMAINS, type ProfileFormValues } from "./schemas";

export function InterestedDomainsField() {
  const { control } = useFormContext<ProfileFormValues>();
  const {
    field: { value, onChange },
  } = useController({ name: "interestedDomains", control });
  const labelId = useId();
  const { isMobile } = useMediaQueryFlags();

  const isFull = value.length >= MAX_INTERESTED_DOMAINS;

  return (
    <div className="flex flex-col gap-12">
      <span
        id={labelId}
        className="flex items-start gap-2 font-label text-label-sm font-label-normal text-object-neutral"
      >
        관심 도메인 (최대 {MAX_INTERESTED_DOMAINS}개)
        <span aria-hidden className="-mt-2 text-feedback-notifying-static-inverse-bold">
          *
        </span>
        <span className={visuallyHidden}>필수</span>
      </span>
      <CheckboxGroup
        size="md"
        variant="outlined"
        layout="grid"
        stretched
        columns={isMobile ? 2 : 3}
        aria-labelledby={labelId}
        options={INTERESTED_DOMAIN_OPTIONS.map((option) => ({
          ...option,
          disabled: isFull && !value.includes(option.value),
        }))}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
