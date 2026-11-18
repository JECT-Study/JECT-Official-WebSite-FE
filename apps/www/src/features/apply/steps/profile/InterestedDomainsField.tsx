"use client";

import { MultiSelectField } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

import { INTERESTED_DOMAIN_OPTIONS } from "./options";
import { MAX_INTERESTED_DOMAINS, type ProfileFormValues } from "./schemas";

export function InterestedDomainsField() {
  const { control } = useFormContext<ProfileFormValues>();
  const {
    field: { ref, name, value, onChange, onBlur },
  } = useController({ name: "interestedDomains", control });

  return (
    <MultiSelectField>
      <MultiSelectField.Label>관심 도메인</MultiSelectField.Label>
      <MultiSelectField.Input
        ref={ref}
        name={name}
        required
        options={INTERESTED_DOMAIN_OPTIONS}
        maxValues={MAX_INTERESTED_DOMAINS}
        placeholder="관심 있는 도메인을 선택해주세요"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <MultiSelectField.Footer>
        <MultiSelectField.Counter />
      </MultiSelectField.Footer>
    </MultiSelectField>
  );
}
