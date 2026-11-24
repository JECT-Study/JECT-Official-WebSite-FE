import { z } from "zod";

import {
  type ApplyDetail,
  careerDetailsSchema,
  experiencePeriodSchema,
  regionSchema,
  selectionResultSchema,
} from "@/apis/apply/schemas";
import { jobFamilySchema, recruitTypeSchema } from "@/apis/schemas";

// TODO: 편집 모드를 구현할 때 입력값 검증 규칙을 추가한다.
export const submittedApplyFormSchema = z.object({
  jobFamily: jobFamilySchema,
  recruitType: recruitTypeSchema,
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  careerDetails: careerDetailsSchema,
  region: regionSchema.nullable(),
  experiencePeriod: experiencePeriodSchema.nullable(),
  interestedDomains: z.array(z.string()),
  selectionResult: selectionResultSchema,
  note: z.string(),
  // 질문 ID를 키로 쓰면 react-hook-form이 숫자 경로를 배열 인덱스로 해석하므로 배열로 둔다.
  answers: z.array(z.object({ questionId: z.number(), answer: z.string() })),
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
});
