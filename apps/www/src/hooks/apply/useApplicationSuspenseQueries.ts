import { useSuspenseQueries } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueryKeys } from "@/apis/apply/queryKeys";
import { hasErrorCode } from "@/errors/hasErrorCode";

export function useApplicationSuspenseQueries(recruitId: number) {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: applyQueryKeys.questions(recruitId),
        queryFn: () => applyApi.getQuestions(recruitId),
      },
      {
        queryKey: applyQueryKeys.tempApplication(recruitId),
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
      },
    ],
    combine: ([questions, tempApplication]) => ({
      questions: [...questions.data.questionResponses].sort((a, b) => a.sequence - b.sequence),
      tempApplication: tempApplication.data,
    }),
  });
}
