import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyMutationKeys, applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { hasErrorCode } from "@/errors/hasErrorCode";

export function useDeleteSubmittedAppliesMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationKey: applyMutationKeys.deleteSubmittedApplies(),
    mutationFn: applyApi.deleteSubmittedApplies,
    onSuccess: async (deletedCount) => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      // 서버는 이미 삭제된 지원서를 에러 없이 건너뛰므로 모두 삭제된 상태였다면 0을 반환한다.
      if (deletedCount === 0) {
        toast.basic("이미 삭제된 지원서예요");
        return;
      }
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
