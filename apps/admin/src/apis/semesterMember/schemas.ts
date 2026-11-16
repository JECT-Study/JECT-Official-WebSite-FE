import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

const jobFamilySchema = z.enum([
  "PM",
  "PD",
  "FE",
  "BE",
  "APP",
  "OPS",
  "INFRA",
  "BX",
  "ER",
]) satisfies z.ZodType<Schemas["JobFamily"]>;

const careerDetailsSchema = z.enum([
  "STUDENT",
  "EXPECTED_GRADUATE",
  "JOB_SEEKER",
  "BETWEEN_JOBS",
  "EMPLOYEE",
]) satisfies z.ZodType<Schemas["CareerDetails"]>;

const experiencePeriodSchema = z.enum([
  "NONE",
  "ONE_TO_TWO",
  "THREE_TO_FOUR",
  "FIVE_PLUS",
]) satisfies z.ZodType<Schemas["ExperiencePeriod"]>;

const activityStatusSchema = z.enum([
  "ACTIVE",
  "COMPLETED",
  "WITHDRAWN",
  "ENDED",
  "DROPOUT",
]) satisfies z.ZodType<Schemas["ActivityStatus"]>;

const semesterMemberSchema = z.object({
  memberActivityId: z.number(),
  name: z.string().nullable(),
  jobFamily: jobFamilySchema.nullable(),
  phoneNumber: z.string().nullable(),
  careerDetails: careerDetailsSchema.nullable(),
  experiencePeriod: experiencePeriodSchema.nullable(),
  status: activityStatusSchema,
}) satisfies z.ZodType<NullableFields<Schemas["SearchMemberSemesterResponse"]>>;

export const semesterMemberPageSchema = z.object({
  content: z.array(semesterMemberSchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullish(),
  totalCount: z.number(),
}) satisfies z.ZodType<
  NullableFields<Omit<Schemas["CursorPageResponseSearchMemberSemesterResponse"], "content">>
>;

export type SemesterMember = z.infer<typeof semesterMemberSchema>;
