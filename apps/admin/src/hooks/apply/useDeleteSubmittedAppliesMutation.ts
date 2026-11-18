import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";

export function useDeleteSubmittedAppliesMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: applyApi.deleteSubmittedApplies,
    onSuccess: async (deletedCount) => {
      await queryClient.invalidateQueries({ queryKey: applyQueries.submittedAppliesLists() });
      toast.positive(`${deletedCount}개를 삭제했어요`);
    },
    onError: () => {
      toast.destructive("지원서를 삭제하지 못했습니다", {
        description: "잠시 후 다시 시도해 주세요.",
      });
    },
  });
}
