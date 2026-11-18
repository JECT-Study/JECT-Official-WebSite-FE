import { httpClient } from "@/apis/httpClient/server";
import { pageableQuerySerializer } from "@/apis/pageable";

import { miniStudyPageSchema } from "./schemas";

// 페이지 단위로 나누어 보여주지 않으므로 한 번에 모두 조회한다.
const PAGE_SIZE = 100;

export const miniStudyServerApi = {
  getMiniStudies: async () => {
    const { data } = await httpClient.GET("/ministudies", {
      params: { query: { pageable: { page: 0, size: PAGE_SIZE } } },
      querySerializer: pageableQuerySerializer,
      credentials: "omit",
    });

    return miniStudyPageSchema.parse(data).content;
  },
} as const;
