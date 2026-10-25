import { httpClient } from "@/apis/httpClient/server";
import { API_ENDPOINTS } from "@/constants/endpoints";

import { activeRecruitmentsSchema, recruitSchema } from "./schemas";

export const recruitApi = {
  getActiveRecruitments: () =>
    httpClient.get(API_ENDPOINTS.activeRecruits, activeRecruitmentsSchema),

  getRecruit: (recruitId: number) =>
    httpClient.get(API_ENDPOINTS.recruit(recruitId), recruitSchema),
} as const;
