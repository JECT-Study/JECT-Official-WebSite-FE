import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import { localDateTimeSchema } from "@/apis/schemas";
import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

// 서버에서 사용하지 않는 SUPPORTER는 제외한다.
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

const recruitTypeSchema = z.enum(["SEMESTER", "MAKERS", "SUPPORTERS"]) satisfies z.ZodType<
  Schemas["RecruitType"]
>;

const applyManagementRecruitSchema = z.object({
  recruitId: z.number(),
  title: z.string().nullable(),
  semesterId: z.number().nullable(),
  semesterName: z.string().nullable(),
  recruitType: recruitTypeSchema,
  jobFamily: jobFamilySchema,
  startDate: localDateTimeSchema,
  endDate: localDateTimeSchema,
  submittedApplyCount: z.number(),
  passedCount: z.number(),
  failedCount: z.number(),
  waitlistedCount: z.number(),
}) satisfies z.ZodType<NullableFields<Schemas["ApplyManagementRecruitResponse"]>>;

const recruitTypeCountSchema = z.object({
  recruitType: recruitTypeSchema,
  count: z.number(),
}) satisfies z.ZodType<Schemas["RecruitTypeCountResponse"]>;

export const applyManagementRecruitsSchema = z.object({
  recruitTypeCounts: z.array(recruitTypeCountSchema),
  // content 항목의 타입은 applyManagementRecruitSchema의 satisfies에서 검사하므로 여기서는 제외한다.
  recruits: z.object({
    content: z.array(applyManagementRecruitSchema),
    size: z.number(),
    hasNext: z.boolean(),
    nextCursor: z.number().nullish(),
    totalCount: z.number(),
  }) satisfies z.ZodType<
    NullableFields<Omit<Schemas["CursorPageResponseApplyManagementRecruitResponse"], "content">>
  >,
});

export type JobFamily = z.infer<typeof jobFamilySchema>;
export type RecruitType = z.infer<typeof recruitTypeSchema>;
export type ApplyManagementRecruit = z.infer<typeof applyManagementRecruitSchema>;
