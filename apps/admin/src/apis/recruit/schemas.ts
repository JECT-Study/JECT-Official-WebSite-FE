import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import { jobFamilySchema, localDateTimeSchema } from "@/apis/schemas";

type Schemas = components["schemas"];

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
}) satisfies z.ZodType<Schemas["ApplyManagementRecruitResponse"]>;

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
    nextCursor: z.number().nullable(),
    totalCount: z.number(),
  }) satisfies z.ZodType<
    Omit<Schemas["CursorPageResponseApplyManagementRecruitResponse"], "content">
  >,
});

export type RecruitType = z.infer<typeof recruitTypeSchema>;
export type ApplyManagementRecruit = z.infer<typeof applyManagementRecruitSchema>;
