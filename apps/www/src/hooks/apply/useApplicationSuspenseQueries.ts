import { useSuspenseQueries } from "@tanstack/react-query";

import { applyQueries } from "@/apis/apply/queries";

export function useApplicationSuspenseQueries(recruitId: number) {
  return useSuspenseQueries({
    queries: [applyQueries.questions(recruitId), applyQueries.tempApplication(recruitId)],
    combine: ([questions, tempApplication]) => ({
      questions: questions.data.questionResponses,
      tempApplication: tempApplication.data,
    }),
  });
}
