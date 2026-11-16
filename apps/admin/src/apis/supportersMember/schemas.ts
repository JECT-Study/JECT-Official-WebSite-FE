import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import { jobFamilySchema } from "@/apis/recruit/schemas";
import type { NullableFields } from "@/apis/types";
import { ACTIVITY_STATUSES, RECRUIT_TYPE_DETAILS } from "@/constants/supportersMember";

type Schemas = components["schemas"];

const supportersMemberSchema = z.object({
  memberActivityId: z.number(),
  name: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  jobFamily: jobFamilySchema.nullable(),
  recruitTypeDetail: z.enum(RECRUIT_TYPE_DETAILS),
  activityStatus: z.enum(ACTIVITY_STATUSES),
  memo: z.string().nullable(),
}) satisfies z.ZodType<NullableFields<Schemas["MemberSupportersListResponse"]>>;

// content 항목의 타입은 supportersMemberSchema의 satisfies에서 검사하므로 여기서는 제외한다.
export const supportersMemberPageSchema = z.object({
  content: z.array(supportersMemberSchema),
  size: z.number(),
  hasNext: z.boolean(),
  nextCursor: z.number().nullish(),
  totalCount: z.number(),
}) satisfies z.ZodType<
  NullableFields<Omit<Schemas["CursorPageResponseMemberSupportersListResponse"], "content">>
>;

export type SupportersMember = z.infer<typeof supportersMemberSchema>;
export type SupportersMemberPage = z.infer<typeof supportersMemberPageSchema>;
