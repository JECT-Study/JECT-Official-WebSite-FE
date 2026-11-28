import { hasErrorCode } from "@ject/api-client";
import { queryOptions } from "@tanstack/react-query";

import { applyApi } from "./api";

export const applyQueries = {
  all: () => ["apply"] as const,
  questions: (recruitId: number) =>
    queryOptions({
      queryKey: [...applyQueries.all(), "questions", recruitId],
      queryFn: () => applyApi.getQuestions(recruitId),
    }),
  tempApplications: () => [...applyQueries.all(), "tempApplication"] as const,
  tempApplication: (recruitId: number) =>
    queryOptions({
      queryKey: [...applyQueries.tempApplications(), recruitId],
      queryFn: async () => {
        try {
          return await applyApi.getTempApplication(recruitId);
        } catch (error) {
          // 임시 저장 이력이 없으면 서버가 에러를 반환하므로 빈 지원서로 처리한다.
          if (hasErrorCode(error, "APPLY-3")) {
            return null;
          }

          throw error;
        }
      },
    }),
};

export const applyMutationKeys = {
  uploadPortfolio: () => [...applyQueries.all(), "uploadPortfolio"] as const,
};
