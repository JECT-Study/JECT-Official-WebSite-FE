import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

const careerDetailsSchema = z.enum([
  "STUDENT",
  "EXPECTED_GRADUATE",
  "JOB_SEEKER",
  "BETWEEN_JOBS",
  "EMPLOYEE",
]) satisfies z.ZodType<Schemas["CareerDetails"]>;

const selectionResultSchema = z.enum([
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
}) satisfies z.ZodType<NullableFields<Schemas["SubmittedApplyResponse"]>>;

export const submittedAppliesSchema = z.object({
  content: z.array(submittedApplySchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullish(),
  totalCount: z.number(),
  // NullableFields는 안쪽 객체까지 null을 허용하지 않아 content를 제외한다. 항목 타입은 submittedApplySchema에서 검사한다.
}) satisfies z.ZodType<
  NullableFields<Omit<Schemas["CursorPageResponseSubmittedApplyResponse"], "content">>
>;

export type CareerDetails = z.infer<typeof careerDetailsSchema>;
export type SelectionResult = z.infer<typeof selectionResultSchema>;
export type SubmittedApply = z.infer<typeof submittedApplySchema>;
