import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { SELECTION_RESULT_LABELS } from "@/constants/apply";
import { hasErrorCode } from "@/errors/hasErrorCode";

export function useUpdateSelectionResultsMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: applyApi.updateSelectionResults,
    onSuccess: async (_, { applyIds, selectionResult }) => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      toast.positive(
        `${applyIds.length}개를 ${SELECTION_RESULT_LABELS[selectionResult]} 상태로 변경했어요`
      );
    },
    onError: (error, { selectionResult }) => {
      if (hasErrorCode(error, "APPLY-1")) {
        toast.destructive("이미 삭제된 지원서가 포함되어 있어요", {
          description: "새로고침 후 다시 시도해 주세요.",
        });
        return;
      }
      if (hasErrorCode(error, "RECRUIT-12")) {
        toast.destructive("검토가 확정된 공고의 지원서는 변경할 수 없어요");
        return;
      }
      toast.destructive(`${SELECTION_RESULT_LABELS[selectionResult]} 상태로 변경하지 못했습니다`, {
        description: "잠시 후 다시 시도해 주세요.",
      });
    },
  });
}
