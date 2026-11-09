import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

// TODO: 응답의 시간대 표기를 확인한 뒤 형식을 하나로 좁힌다. local 옵션은 Z로 끝나는 값도 허용한다.
const dateTimeSchema = z.iso.datetime({ local: true });

const jobFamilySchema = z.enum([
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

const recruitTypeSchema = z.enum(["SEMESTER", "MAKERS", "SUPPORTERS"]) satisfies z.ZodType<
  Schemas["RecruitType"]
>;

const applyManagementRecruitSchema = z.object({
  recruitId: z.number(),
  title: z.string(),
  semesterId: z.number(),
  semesterName: z.string(),
  recruitType: recruitTypeSchema,
  jobFamily: jobFamilySchema,
  startDate: dateTimeSchema,
  endDate: dateTimeSchema,
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
  recruits: z.object({
    content: z.array(applyManagementRecruitSchema),
    size: z.number(),
    hasNext: z.boolean(),
    nextCursor: z.number().nullish(),
    totalCount: z.number(),
  }) satisfies z.ZodType<
    NullableFields<Schemas["CursorPageResponseApplyManagementRecruitResponse"]>
  >,
});

export type ApplyManagementRecruit = z.infer<typeof applyManagementRecruitSchema>;
export type ApplyManagementRecruits = z.infer<typeof applyManagementRecruitsSchema>;
