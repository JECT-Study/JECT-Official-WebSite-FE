import type { operations } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

import { semesterMemberPageSchema } from "./schemas";

export type SemesterMemberListQuery = NonNullable<
  operations["searchAdminMemberSemesterList"]["parameters"]["query"]
>;

export type SemesterMemberListFilter = Omit<SemesterMemberListQuery, "cursor" | "size">;

export const semesterMemberApi = {
  getSemesterMembers: async (query: SemesterMemberListQuery) => {
    const { data } = await httpClient.GET("/admin/members/semester", { params: { query } });

    return semesterMemberPageSchema.parse(data);
  },
} as const;
