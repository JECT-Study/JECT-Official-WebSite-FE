import { useMutation } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyMutationKeys, applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { TOAST_CONTENT } from "@/constants/toast";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { showToast } from "@/utils/showToast";

export function useDeleteAppliesMutation() {
  return useMutation({
    mutationKey: applyMutationKeys.deleteApplies(),
    mutationFn: applyApi.deleteApplies,
    onSuccess: async (deletedCount) => {
      const queryKey = applyQueries.submittedAppliesLists();
      await queryClient.cancelQueries({ queryKey });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      // 서버는 이미 삭제된 지원서를 에러 없이 건너뛰므로 모두 삭제된 상태였다면 0을 반환한다.
      if (deletedCount === 0) {
        showToast(TOAST_CONTENT.appliesAlreadyDeleted);
        return;
      }
      showToast(TOAST_CONTENT.appliesDeleted(deletedCount));
    },
    onError: (error) => {
      if (hasErrorCode(error, "RECRUIT-12")) {
        showToast(TOAST_CONTENT.deleteConfirmedAppliesNotAllowed);
        return;
      }
      showToast(TOAST_CONTENT.deleteAppliesFailed);
    },
  });
}
