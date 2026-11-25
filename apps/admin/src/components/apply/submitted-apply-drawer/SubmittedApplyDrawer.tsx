import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  File,
  IconButton,
  LabelButton,
  MultiSelectField,
  SelectField,
  type SelectOption,
  Textarea,
  TextField,
} from "@jects/jds";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { applyQueries } from "@/apis/apply/queries";
import { Drawer } from "@/components/common/drawer/Drawer";
import {
  CAREER_DETAILS_LABELS,
  EXPERIENCE_PERIOD_LABELS,
  INTERESTED_DOMAIN_LABELS,
  REGION_LABELS,
  SELECTION_RESULT_LABELS,
} from "@/constants/apply";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";
import { RECRUIT_TYPE_LABELS } from "@/constants/recruitType";

import { submittedApplyFormSchema, type SubmittedApplyFormValues, toFormValues } from "./schemas";

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

type QuestionInputType = "TEXT" | "URL" | "FILE";

// TODO: 상세 응답에 질문의 inputType이 추가되면 제목으로 추정하지 않고 그 값을 사용한다.
const getQuestionInputType = (title: string): QuestionInputType => {
  if (title.includes("포트폴리오")) return "FILE";
  if (title.includes("GitHub") || title.includes("블로그")) return "URL";
  return "TEXT";
};

interface SubmittedApplyDrawerProps {
  applyId: number | null;
  onClose: () => void;
}

export default function SubmittedApplyDrawer({ applyId, onClose }: SubmittedApplyDrawerProps) {
  const { data } = useQuery(applyQueries.detail(applyId));
  const { register, control } = useForm<SubmittedApplyFormValues>({
    resolver: zodResolver(submittedApplyFormSchema),
    values: data && toFormValues(data),
    // 편집 중 재조회되어도 사용자가 수정한 값은 덮어쓰지 않는다.
    resetOptions: { keepDirtyValues: true },
  });

  return (
    <Drawer
      open={applyId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="지원서 정보"
      headerAction={
        <div className="flex items-center gap-16 max-tablet:hidden">
          <LabelButton hierarchy="tertiary" size="md">
            편집
          </LabelButton>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton hierarchy="tertiary" size="lg" icon="ellipsis" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" sideOffset={12} className="w-[160px]">
              <DropdownMenu.Group>
                <DropdownMenu.Button prefixIcon="clock-3" prefixIconVisible>
                  변경 이력
                </DropdownMenu.Button>
                {/* JDS 메뉴 항목에 색 옵션이 없어 아이콘과 라벨에 직접 지정한다. */}
                <DropdownMenu.Button
                  prefixIcon="trash"
                  prefixIconVisible
                  className="*:text-feedback-destructive-neutral"
                >
                  삭제
                </DropdownMenu.Button>
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      }
    >
      <form>
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
              <MultiSelectField.Label tooltip="최대 3개까지 선택">
                관심 도메인
              </MultiSelectField.Label>
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
              <TextField.Label tooltip="예비 번호는 지원서 목록에서 변경">
                예비 번호
              </TextField.Label>
              <TextField.Input
                placeholder="예비 합격 상태일 때 확인할 수 있어요"
                value={data?.waitlistNumber ?? ""}
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
        <div className="flex flex-col gap-32 px-margin-lg pt-24 pb-96 tablet:pt-32">
          {data?.answers.map(({ questionId, questionTitle }, index) => {
            const inputType = getQuestionInputType(questionTitle);

            return (
              <section key={questionId} className="flex flex-col gap-16">
                <h3 className="text-title-1 font-title-subtle text-object-boldest">
                  {index + 1}. {questionTitle}
                </h3>
                {inputType === "TEXT" && (
                  <Textarea readonly>
                    <Textarea.Control maxLength={500} {...register(`answers.${index}.answer`)} />
                    <Textarea.Footer>
                      <Textarea.Counter />
                    </Textarea.Footer>
                  </Textarea>
                )}
                {/* TODO: JDS에 태그 필드가 추가되면 교체한다. */}
                {inputType === "URL" && (
                  <TextField readonly>
                    <TextField.Input {...register(`answers.${index}.answer`)} />
                  </TextField>
                )}
                {inputType === "FILE" &&
                  data.portfolios.map(({ portfolioId, fileName, fileSize }) => (
                    <File
                      key={portfolioId}
                      fileName={fileName}
                      fileSize={Number(fileSize)}
                      readonly
                    />
                  ))}
              </section>
            );
          })}
        </div>
      </form>
    </Drawer>
  );
}
