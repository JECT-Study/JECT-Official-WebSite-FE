import { httpClient } from "@/apis/httpClient";
import { SUPPORTERS_MEMBER_PAGE_SIZE } from "@/constants/supportersMember";

import { supportersMemberPageSchema } from "./schemas";

export const supportersMemberApi = {
  getSupportersMembers: async (cursor: number | undefined) => {
    const { data } = await httpClient.GET("/admin/members/supporters", {
      params: { query: { cursor, size: SUPPORTERS_MEMBER_PAGE_SIZE } },
    });

    return supportersMemberPageSchema.parse(data);
  },
} as const;
