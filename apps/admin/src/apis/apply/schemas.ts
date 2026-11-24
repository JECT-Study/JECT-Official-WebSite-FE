import type { components, operations } from "@ject/api-types/admin";
import { z } from "zod";

import { jobFamilySchema, recruitTypeSchema } from "@/apis/schemas";

type Schemas = components["schemas"];

export const careerDetailsSchema = z.enum([
  "STUDENT",
  "EXPECTED_GRADUATE",
  "JOB_SEEKER",
  "BETWEEN_JOBS",
  "EMPLOYEE",
]) satisfies z.ZodType<Schemas["CareerDetails"]>;

export const selectionResultSchema = z.enum([
  "UNDECIDED",
  "PASSED",
  "WAITLISTED",
  "FAILED",
]) satisfies z.ZodType<Schemas["SelectionResult"]>;

const submittedApplySchema = z.object({
  applyId: z.number(),
  name: z.string(),
  phoneNumber: z.string(),
  careerDetails: careerDetailsSchema,
  selectionResult: selectionResultSchema,
  waitlistNumber: z.number().nullable(),
  note: z.string(),
}) satisfies z.ZodType<Schemas["SubmittedApplyResponse"]>;

export const submittedAppliesSchema = z.object({
  recruitTitle: z.string(),
  content: z.array(submittedApplySchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullable(),
  totalCount: z.number(),
}) satisfies z.ZodType<Schemas["ApplyListResponseSubmittedApplyResponse"]>;

export const regionSchema = z.enum([
  "SEOUL",
  "GYEONGGI",
  "INCHEON",
  "BUSAN",
  "DAEGU",
  "DAEJEON",
  "GWANGJU",
  "ULSAN",
  "SEJONG",
  "GANGWON",
  "CHUNGBUK",
  "CHUNGNAM",
  "JEONBUK",
  "JEONNAM",
  "GYEONGBUK",
  "GYEONGNAM",
  "JEJU",
  "OVERSEAS",
]) satisfies z.ZodType<Schemas["Region"]>;

export const experiencePeriodSchema = z.enum([
  "NONE",
  "ONE_TO_TWO",
  "THREE_TO_FOUR",
  "FIVE_PLUS",
]) satisfies z.ZodType<Schemas["ExperiencePeriod"]>;

export const applyDetailSchema = z.object({
  applyId: z.number(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  jobFamily: jobFamilySchema,
  careerDetails: careerDetailsSchema,
  recruitType: recruitTypeSchema,
  selectionResult: selectionResultSchema,
  waitlistNumber: z.number().nullable(),
  note: z.string(),
  region: regionSchema.nullable(),
  experiencePeriod: experiencePeriodSchema.nullable(),
  interestedDomains: z.array(z.string()),
  answers: z.array(
    z.object({
      questionId: z.number(),
      questionTitle: z.string(),
      answer: z.string().nullable(),
    })
  ),
  portfolios: z.array(
    z.object({
      portfolioId: z.number(),
      fileUrl: z.string(),
      fileName: z.string(),
      fileSize: z.string(),
      sequence: z.string(),
    })
  ),
}) satisfies z.ZodType<Schemas["AdminApplyDetailResponse"]>;

type DeletedAppliesCount =
  operations["deleteSubmittedApplies"]["responses"][200]["content"]["*/*"]["data"];

/** 실제로 삭제된 지원서 수다. 없거나 이미 삭제된 지원서는 세지 않는다. */
export const deletedAppliesCountSchema = z.number() satisfies z.ZodType<DeletedAppliesCount>;

export type CareerDetails = z.infer<typeof careerDetailsSchema>;
export type SelectionResult = z.infer<typeof selectionResultSchema>;
export type SubmittedApply = z.infer<typeof submittedApplySchema>;
export type Region = z.infer<typeof regionSchema>;
export type ExperiencePeriod = z.infer<typeof experiencePeriodSchema>;
export type ApplyDetail = z.infer<typeof applyDetailSchema>;
