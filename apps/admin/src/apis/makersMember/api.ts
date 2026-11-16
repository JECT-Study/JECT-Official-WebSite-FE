import type { operations } from "@ject/api-types/admin";

import { httpClient } from "@/apis/httpClient";

import { makersMemberPageSchema } from "./schemas";

export type MakersMemberListQuery = NonNullable<
  operations["getAdminMemberMakersList"]["parameters"]["query"]
>;

export const makersMemberApi = {
  getMakersMembers: async (query: MakersMemberListQuery) => {
    const { data } = await httpClient.GET("/admin/members/makers", { params: { query } });

    return makersMemberPageSchema.parse(data);
  },
} as const;
