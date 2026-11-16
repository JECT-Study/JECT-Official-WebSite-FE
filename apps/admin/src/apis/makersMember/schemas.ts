import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";
import { ACTIVITY_STATUSES, MAKERS_TEAMS, RECRUIT_TYPE_DETAILS } from "@/constants/makersMember";

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

const makersMemberSchema = z.object({
  memberActivityId: z.number(),
  name: z.string().nullable(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  jobFamily: jobFamilySchema.nullable(),
  makersTeam: z.enum(MAKERS_TEAMS).nullable(),
  recruitTypeDetail: z.enum(RECRUIT_TYPE_DETAILS),
  activityStatus: z.enum(ACTIVITY_STATUSES),
  memo: z.string().nullable(),
}) satisfies z.ZodType<NullableFields<Schemas["MemberMakersListResponse"]>>;

// content 항목의 타입은 makersMemberSchema의 satisfies에서 검사하므로 여기서는 제외한다.
export const makersMemberPageSchema = z.object({
  content: z.array(makersMemberSchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullish(),
  totalCount: z.number(),
}) satisfies z.ZodType<
  NullableFields<Omit<Schemas["CursorPageResponseMemberMakersListResponse"], "content">>
>;

export type MakersMember = z.infer<typeof makersMemberSchema>;
export type MakersMemberPage = z.infer<typeof makersMemberPageSchema>;
