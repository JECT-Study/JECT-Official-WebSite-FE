import { MultiSelectField, SelectField, type SelectOption, Textarea, TextField } from "@jects/jds";
import { Controller, useFormContext } from "react-hook-form";

import {
  CAREER_DETAILS_LABELS,
  EXPERIENCE_PERIOD_LABELS,
  INTERESTED_DOMAIN_LABELS,
  REGION_LABELS,
  SELECTION_RESULT_LABELS,
} from "@/constants/apply";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import { RECRUIT_TYPE_LABELS } from "@/constants/recruitType";

import type { SubmittedApplyFormValues } from "./schemas";

const toOptions = (labels: Record<string, string>): SelectOption[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const JOB_FAMILY_OPTIONS: SelectOption[] = Object.entries(JOB_FAMILY_BADGES).map(
  ([value, { label }]) => ({ value, label })
);
const RECRUIT_TYPE_OPTIONS = toOptions(RECRUIT_TYPE_LABELS);
const CAREER_DETAILS_OPTIONS = toOptions(CAREER_DETAILS_LABELS);
const REGION_OPTIONS = toOptions(REGION_LABELS);
const EXPERIENCE_PERIOD_OPTIONS = toOptions(EXPERIENCE_PERIOD_LABELS);
const INTERESTED_DOMAIN_OPTIONS = toOptions(INTERESTED_DOMAIN_LABELS);
const SELECTION_RESULT_OPTIONS = toOptions(SELECTION_RESULT_LABELS);

interface BasicInfoFieldsProps {
  waitlistNumber?: number | null;
}

export function BasicInfoFields({ waitlistNumber }: BasicInfoFieldsProps) {
  const { register, control } = useFormContext<SubmittedApplyFormValues>();

  return (
    <div className="flex flex-col gap-16 border-b border-stroke-alpha-subtler px-margin-lg pt-8 pb-20">
      <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2">
        <SelectField readonly required>
          <SelectField.Label>포지션</SelectField.Label>
          <Controller
            control={control}
            name="jobFamily"
            render={({ field }) => (
              <SelectField.Input
                options={JOB_FAMILY_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <SelectField readonly required>
          <SelectField.Label>모집 단위</SelectField.Label>
          <Controller
            control={control}
            name="recruitType"
            render={({ field }) => (
              <SelectField.Input
                options={RECRUIT_TYPE_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <TextField readonly required>
          <TextField.Label>이름</TextField.Label>
          <TextField.Input {...register("name")} />
        </TextField>
        <TextField readonly required>
          <TextField.Label>휴대폰 번호</TextField.Label>
          <TextField.Input {...register("phoneNumber")} />
        </TextField>
        <SelectField readonly required>
          <SelectField.Label>지원자 신분</SelectField.Label>
          <Controller
            control={control}
            name="careerDetails"
            render={({ field }) => (
              <SelectField.Input
                options={CAREER_DETAILS_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <TextField readonly>
          <TextField.Label>이메일</TextField.Label>
          <TextField.Input {...register("email")} />
        </TextField>
        <SelectField readonly>
          <SelectField.Label>거주 지역</SelectField.Label>
          <Controller
            control={control}
            name="region"
            render={({ field }) => (
              <SelectField.Input
                options={REGION_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <SelectField readonly>
          <SelectField.Label>직무 관련 경험 기간</SelectField.Label>
          <Controller
            control={control}
            name="experiencePeriod"
            render={({ field }) => (
              <SelectField.Input
                options={EXPERIENCE_PERIOD_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <MultiSelectField readonly>
          <MultiSelectField.Label tooltip="최대 3개까지 선택">관심 도메인</MultiSelectField.Label>
          <Controller
            control={control}
            name="interestedDomains"
            render={({ field }) => (
              <MultiSelectField.Input
                options={INTERESTED_DOMAIN_OPTIONS}
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </MultiSelectField>
        <SelectField readonly>
          <SelectField.Label>합격 여부</SelectField.Label>
          <Controller
            control={control}
            name="selectionResult"
            render={({ field }) => (
              <SelectField.Input
                options={SELECTION_RESULT_OPTIONS}
                placeholder="옵션을 선택해주세요"
                value={field.value ?? null}
                onChange={field.onChange}
              />
            )}
          />
        </SelectField>
        <TextField readonly>
          <TextField.Label tooltip="예비 번호는 지원서 목록에서 변경">예비 번호</TextField.Label>
          <TextField.Input
            placeholder="예비 합격 상태일 때 확인할 수 있어요"
            value={waitlistNumber ?? ""}
          />
        </TextField>
      </div>
      <Textarea readonly>
        <Textarea.Label>비고</Textarea.Label>
        <Textarea.Control maxLength={100} {...register("note")} />
        <Textarea.Footer>
          <Textarea.Counter />
        </Textarea.Footer>
      </Textarea>
    </div>
  );
}
