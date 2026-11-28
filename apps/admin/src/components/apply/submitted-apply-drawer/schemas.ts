import { z } from "zod";

import type { EditApplyRequest } from "@/apis/apply/api";
import {
  type ApplyDetail,
  careerDetailsSchema,
  experiencePeriodSchema,
  regionSchema,
  selectionResultSchema,
} from "@/apis/apply/schemas";
import { jobFamilySchema, recruitTypeSchema } from "@/apis/schemas";

export const MAX_INTERESTED_DOMAINS = 3;
export const MAX_NOTE_LENGTH = 100;
export const MAX_ANSWER_LENGTH = 500;

export const submittedApplyFormSchema = z.object({
  jobFamily: jobFamilySchema,
  recruitType: recruitTypeSchema,
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .regex(/^\S{1,5}$/, "공백 없이 최대 5자까지 입력할 수 있어요."),
  phoneNumber: z
    .string()
    .length(11, "11자를 입력해주세요.")
    .regex(/^010\d{8}$/, "010으로 시작하는 숫자를 입력해주세요."),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .max(30, "30자 이하로 입력해주세요.")
    .pipe(z.email("올바른 이메일 형식을 완성해주세요.")),
  careerDetails: careerDetailsSchema,
  region: regionSchema.nullable(),
  experiencePeriod: experiencePeriodSchema.nullable(),
  interestedDomains: z
    .array(z.string())
    .min(1, "관심 도메인을 1개 이상 선택해주세요.")
    .max(MAX_INTERESTED_DOMAINS),
  selectionResult: selectionResultSchema,
  note: z.string().max(MAX_NOTE_LENGTH),
  // 질문 ID를 키로 쓰면 react-hook-form이 숫자 경로를 배열 인덱스로 해석하므로 배열로 둔다.
  answers: z.array(z.object({ questionId: z.number(), answer: z.string().max(MAX_ANSWER_LENGTH) })),
  deletePortfolioIds: z.array(z.number()),
});

export type SubmittedApplyFormValues = z.infer<typeof submittedApplyFormSchema>;

export const toFormValues = (apply: ApplyDetail): SubmittedApplyFormValues => ({
  jobFamily: apply.jobFamily,
  recruitType: apply.recruitType,
  name: apply.name,
  phoneNumber: apply.phoneNumber,
  email: apply.email,
  careerDetails: apply.careerDetails,
  region: apply.region,
  experiencePeriod: apply.experiencePeriod,
  interestedDomains: apply.interestedDomains,
  selectionResult: apply.selectionResult,
  note: apply.note,
  answers: apply.answers.map(({ questionId, answer }) => ({ questionId, answer: answer ?? "" })),
  deletePortfolioIds: [],
});

export const toEditApplyRequest = ({
  region,
  experiencePeriod,
  answers,
  ...values
}: SubmittedApplyFormValues): EditApplyRequest => ({
  name: values.name,
  phoneNumber: values.phoneNumber,
  email: values.email,
  careerDetails: values.careerDetails,
  region: region ?? undefined,
  experiencePeriod: experiencePeriod ?? undefined,
  interestedDomains: values.interestedDomains,
  selectionResult: values.selectionResult,
  note: values.note,
  deletePortfolioIds: values.deletePortfolioIds,
  // 답하지 않은 질문은 빈 문자열로 저장하지 않도록 요청에서 뺀다.
  answers: Object.fromEntries(
    answers
      .filter(({ answer }) => answer !== "")
      .map(({ questionId, answer }) => [questionId, answer])
  ),
});
