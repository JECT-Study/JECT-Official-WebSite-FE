import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { TOAST_CONTENT } from "@/constants/toast";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { showToast } from "@/utils/showToast";

export function useDeleteApplyMutation() {
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
      showToast(TOAST_CONTENT.applyDeleted);
    },
    onError: (error) => {
      if (hasErrorCode(error, "APPLY-1")) {
        showToast(TOAST_CONTENT.applyAlreadyDeleted);
        return;
      }
      if (hasErrorCode(error, "RECRUIT-12")) {
        showToast(TOAST_CONTENT.deleteConfirmedAppliesNotAllowed);
        return;
      }
      showToast(TOAST_CONTENT.deleteAppliesFailed);
    },
  });
}
