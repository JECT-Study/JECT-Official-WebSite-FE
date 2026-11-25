import type { components, operations } from "@ject/api-types/admin";
import { z } from "zod";

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
}) satisfies z.ZodType<Schemas["SubmittedApplyResponse"]>;

export const submittedAppliesSchema = z.object({
  content: z.array(submittedApplySchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullable(),
  totalCount: z.number(),
  // content 항목의 타입은 submittedApplySchema의 satisfies에서 검사하므로 여기서는 제외한다.
}) satisfies z.ZodType<Omit<Schemas["CursorPageResponseSubmittedApplyResponse"], "content">>;

type DeletedAppliesCount =
  operations["deleteSubmittedApplies"]["responses"][200]["content"]["*/*"]["data"];

/** 실제로 삭제된 지원서 수다. 없거나 이미 삭제된 지원서는 세지 않는다. */
export const deletedAppliesCountSchema = z.number() satisfies z.ZodType<DeletedAppliesCount>;

export type CareerDetails = z.infer<typeof careerDetailsSchema>;
export type SelectionResult = z.infer<typeof selectionResultSchema>;
export type SubmittedApply = z.infer<typeof submittedApplySchema>;
