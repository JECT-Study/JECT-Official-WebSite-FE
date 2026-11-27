import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { hasErrorCode } from "@/errors/hasErrorCode";

export function useDeleteApplyMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: applyApi.deleteApply,
    // 삭제한 지원서의 상세는 다시 조회하면 APPLY-1이 나므로 목록만 무효화한다.
    onSuccess: async () => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      toast.positive("지원서를 삭제했어요");
    },
    onError: (error) => {
      if (hasErrorCode(error, "APPLY-1")) {
        toast.destructive("이미 삭제된 지원서예요");
        return;
      }
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
