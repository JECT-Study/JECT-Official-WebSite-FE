"use client";

import type { ReactNode } from "react";

import { SelectField, type SelectOption } from "@jects/jds";
import { useController, useFormContext } from "react-hook-form";

import type { ProfileFormValues } from "./schemas";

type ProfileSelectName = "careerDetails" | "region" | "experiencePeriod";

interface ProfileSelectOption<T extends string> extends SelectOption {
  value: T;
}

interface ProfileSelectFieldProps<T extends ProfileSelectName> {
  name: T;
  label: string;
  labelSuffix?: ReactNode;
  placeholder: string;
  options: ProfileSelectOption<ProfileFormValues[T]>[];
}

export function ProfileSelectField<T extends ProfileSelectName>({
  name,
  label,
  labelSuffix,
  placeholder,
  options,
}: ProfileSelectFieldProps<T>) {
  const { control } = useFormContext<ProfileFormValues>();
  const {
    field: { ref, value, onChange, onBlur },
  } = useController({ name, control });

  return (
    <SelectField>
      <SelectField.Label suffix={labelSuffix}>{label}</SelectField.Label>
      <SelectField.Input
        ref={ref}
        name={name}
        required
        options={options}
        placeholder={placeholder}
        value={value ?? null}
        onChange={onChange}
        onBlur={onBlur}
      />
    </SelectField>
  );
}
