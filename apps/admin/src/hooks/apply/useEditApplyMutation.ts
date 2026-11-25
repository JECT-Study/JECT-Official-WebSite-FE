import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { applyApi, type EditApplyRequest } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { hasErrorCode } from "@/errors/hasErrorCode";

interface EditApplyVariables {
  applyId: number;
  body: EditApplyRequest;
}

export function useEditApplyMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ applyId, body }: EditApplyVariables) => applyApi.editApply(applyId, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applyQueries.all() }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      toast.positive("변경사항을 저장했어요.");
    },
    onError: (error) => {
      if (hasErrorCode(error, "APPLY-1")) {
        toast.destructive("이미 삭제된 지원서예요");
        return;
      }
      if (hasErrorCode(error, "RECRUIT-12")) {
        toast.destructive("검토가 확정된 공고의 지원서는 변경할 수 없어요");
        return;
      }
      toast.destructive("지원서를 저장하지 못했습니다", {
        description: "잠시 후 다시 시도해 주세요.",
      });
    },
  });
}
