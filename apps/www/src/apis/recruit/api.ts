import { httpClient } from "@/apis/httpClient/server";

import { activeRecruitmentsSchema, recruitSchema } from "./schemas";

export const recruitApi = {
  getActiveRecruitments: async () => {
    const { data } = await httpClient.GET("/recruits/active");

    return activeRecruitmentsSchema.parse(data);
  },

  getRecruit: async (recruitId: number) => {
    const { data } = await httpClient.GET("/recruits/{recruitId}", {
      params: { path: { recruitId } },
    });

    return recruitSchema.parse(data);
  },
} as const;
