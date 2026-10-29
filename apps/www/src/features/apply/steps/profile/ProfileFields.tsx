"use client";

import { type ReactNode, useId } from "react";

import {
  CheckboxGroup,
  Icon,
  SelectField,
  type SelectOption,
  TextField,
  Tooltip,
} from "@jects/jds";
import { useMediaQueryFlags } from "@jects/jds/hooks";
import { Controller, useFormContext } from "react-hook-form";

import {
  CAREER_DETAILS_OPTIONS,
  EXPERIENCE_PERIOD_OPTIONS,
  INTERESTED_DOMAIN_OPTIONS,
  REGION_OPTIONS,
} from "./ProfileFields.options";
import {
  MAX_INTERESTED_DOMAINS,
  MAX_NAME_LENGTH,
  type ProfileFormValues,
  removeNonKorean,
} from "./schemas";

function NameField() {
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <TextField>
          <TextField.Label>이름</TextField.Label>
          <TextField.Input
            ref={field.ref}
            name={field.name}
            required
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            placeholder="김젝트"
            value={field.value}
            onBlur={field.onBlur}
            onChange={(event) => {
              field.onChange(removeNonKorean(event.target.value));
            }}
          />
          <TextField.Footer>
            <TextField.Helper>한글만 입력할 수 있어요.</TextField.Helper>
            <TextField.Counter />
          </TextField.Footer>
        </TextField>
      )}
    />
  );
}

function PhoneNumberField() {
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <Controller
      name="phoneNumber"
      control={control}
      render={({ field, fieldState }) => {
        const error = field.value ? fieldState.error : undefined;

        return (
          <TextField status={error ? "error" : "default"}>
            <TextField.Label>휴대폰 번호</TextField.Label>
            <TextField.Input
              ref={field.ref}
              name={field.name}
              required
              type="tel"
              inputMode="numeric"
              maxLength={11}
              autoComplete="tel-national"
              placeholder="01012345678"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(event) => {
                field.onChange(event.target.value.replace(/\D/g, ""));
              }}
            />
            <TextField.Footer>
              <TextField.Helper>
                {error?.message ?? "'-' 없이 숫자만 입력해주세요."}
              </TextField.Helper>
            </TextField.Footer>
          </TextField>
        );
      }}
    />
  );
}

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

function ProfileSelectField<T extends ProfileSelectName>({
  name,
  label,
  labelSuffix,
  placeholder,
  options,
}: ProfileSelectFieldProps<T>) {
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectField>
          <SelectField.Label suffix={labelSuffix}>{label}</SelectField.Label>
          <SelectField.Input
            ref={field.ref}
            name={field.name}
            required
            options={options}
            placeholder={placeholder}
            value={field.value ?? null}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        </SelectField>
      )}
    />
  );
}

function ExperiencePeriodTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          type="button"
          aria-label="직무 관련 경험 기간 안내"
          className="flex text-object-assistive"
        >
          <Icon name="info" size="2xs" />
        </Tooltip.Trigger>
        <Tooltip.Content>학습과 경력을 모두 포함한 기간</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function InterestedDomainsField() {
  const { control } = useFormContext<ProfileFormValues>();
  const labelId = useId();
  const { isMobile } = useMediaQueryFlags();

  return (
    <Controller
      name="interestedDomains"
      control={control}
      render={({ field }) => {
        const isFull = field.value.length >= MAX_INTERESTED_DOMAINS;

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
                disabled: isFull && !field.value.includes(option.value),
              }))}
              value={field.value}
              onChange={field.onChange}
            />
          </div>
        );
      }}
    />
  );
}

export function ProfileFields() {
  return (
    <>
      <NameField />
      <PhoneNumberField />
      <ProfileSelectField
        name="careerDetails"
        label="지원자 신분"
        placeholder="현재 신분을 선택해주세요"
        options={CAREER_DETAILS_OPTIONS}
      />
      <ProfileSelectField
        name="region"
        label="거주 지역"
        placeholder="현재 거주하는 지역을 선택해주세요"
        options={REGION_OPTIONS}
      />
      <ProfileSelectField
        name="experiencePeriod"
        label="직무 관련 경험 기간"
        labelSuffix={<ExperiencePeriodTooltip />}
        placeholder="직무 관련 경험 기간을 선택해주세요"
        options={EXPERIENCE_PERIOD_OPTIONS}
      />
      <InterestedDomainsField />
    </>
  );
}
