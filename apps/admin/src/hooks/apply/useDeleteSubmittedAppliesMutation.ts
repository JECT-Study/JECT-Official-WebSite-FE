import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { hasErrorCode } from "@/errors/hasErrorCode";

export function useDeleteSubmittedAppliesMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: applyApi.deleteSubmittedApplies,
    onSuccess: async (deletedCount) => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey });
      toast.positive(`${deletedCount}개를 삭제했어요`);
    },
    onError: (error) => {
      if (hasErrorCode(error, "RECRUIT-12")) {
        toast.destructive("검토가 확정된 공고의 지원서는 삭제할 수 없어요");
        return;
      }
      toast.destructive("지원서를 삭제하지 못했습니다", {
        description: "잠시 후 다시 시도해 주세요.",
      });
    },
  });
}
