import type { components } from "@ject/api-types/core";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

export const jobFamilySchema = z.enum([
  "PM",
  "PD",
  "FE",
  "BE",
  "APP",
  "SUPPORTER",
  "OPS",
  "INFRA",
  "BX",
  "ER",
]) satisfies z.ZodType<Schemas["JobFamily"]>;

export const recruitTypeSchema = z.enum([
  "SEMESTER",
  "MAKERS",
  "SUPPORTERS",
  "REGULAR",
  "REGULAR_WAITLIST",
  "BACKFILL",
  "MANUAL",
]) satisfies z.ZodType<Schemas["RecruitType"]>;

export const recruitTypeDetailSchema = z.enum(["REGULAR", "NEW", "REFILL"]) satisfies z.ZodType<
  Schemas["RecruitTypeDetail"]
>;

const recruitBaseSchema = z.object({
  recruitId: z.number(),
  semesterId: z.number(),
  semesterName: z.string(),
  recruitType: recruitTypeSchema,
  recruitTypeDescription: z.string(),
  recruitTypeDetail: recruitTypeDetailSchema,
  recruitTypeDetailDescription: z.string(),
  jobFamily: jobFamilySchema,
  jobFamilyDescription: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const activeRecruitmentSchema = recruitBaseSchema.extend({
  summary: z.string().nullable(),
}) satisfies z.ZodType<NullableFields<Schemas["ActiveRecruitmentResponse"]>>;

export const activeRecruitmentsSchema = z.object({
  recruitments: z.array(activeRecruitmentSchema),
});

export const recruitFaqSchema = z.object({
  title: z.string(),
  content: z.string(),
}) satisfies z.ZodType<Schemas["RecruitFaqResponse"]>;

export const recruitSchema = recruitBaseSchema.extend({
  recruitInformation: z.string().nullable(),
  notice: z.string().nullable(),
  faqs: z.array(recruitFaqSchema),
}) satisfies z.ZodType<NullableFields<Schemas["RecruitResponse"]>>;

export type JobFamily = z.infer<typeof jobFamilySchema>;
export type RecruitType = z.infer<typeof recruitTypeSchema>;
export type ActiveRecruitment = z.infer<typeof activeRecruitmentSchema>;
export type Recruit = z.infer<typeof recruitSchema>;
