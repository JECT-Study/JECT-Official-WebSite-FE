import { hasErrorCode } from "@ject/api-client";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyMutationKeys, applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { SELECTION_RESULT_LABELS } from "@/constants/apply";
import { TOAST_CONTENT } from "@/constants/toast";
import { showToast } from "@/utils/showToast";

export function useUpdateSelectionResultsMutation() {
  return useMutation({
    mutationKey: applyMutationKeys.updateSelectionResults(),
    mutationFn: applyApi.updateSelectionResults,
    onSuccess: async (_, { applyIds, selectionResult }) => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      showToast(
        TOAST_CONTENT.selectionResultsUpdated(
          applyIds.length,
          SELECTION_RESULT_LABELS[selectionResult]
        )
      );
    },
    onError: (error, { selectionResult }) => {
      if (hasErrorCode(error, "APPLY-1")) {
        showToast(TOAST_CONTENT.updateIncludesDeletedApplies);
        return;
      }
      if (hasErrorCode(error, "RECRUIT-12")) {
        showToast(TOAST_CONTENT.updateConfirmedAppliesNotAllowed);
        return;
      }
      showToast(
        TOAST_CONTENT.updateSelectionResultsFailed(SELECTION_RESULT_LABELS[selectionResult])
      );
    },
  });
}
