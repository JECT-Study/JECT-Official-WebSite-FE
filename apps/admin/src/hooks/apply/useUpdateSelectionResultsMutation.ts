import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { SELECTION_RESULT_LABELS } from "@/constants/apply";

export function useUpdateSelectionResultsMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: applyApi.updateSelectionResults,
    onSuccess: async (_, { applyIds, selectionResult }) => {
      await queryClient.invalidateQueries({ queryKey: applyQueries.submittedAppliesLists() });
      toast.positive(
        `${applyIds.length}개를 ${SELECTION_RESULT_LABELS[selectionResult]} 상태로 변경했어요`
      );
    },
    onError: (_, { selectionResult }) => {
      toast.destructive(`${SELECTION_RESULT_LABELS[selectionResult]} 상태로 변경하지 못했습니다`, {
        description: "잠시 후 다시 시도해 주세요.",
      });
    },
  });
}
