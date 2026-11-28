import { useMutation } from "@tanstack/react-query";

import { applyApi, type EditApplyRequest } from "@/apis/apply/api";
import { applyQueries } from "@/apis/apply/queries";
import { queryClient } from "@/apis/queryClient";
import { recruitQueries } from "@/apis/recruit/queries";
import { TOAST_CONTENT } from "@/constants/toast";
import { hasErrorCode } from "@/errors/hasErrorCode";
import { showToast } from "@/utils/showToast";

interface EditApplyVariables {
  applyId: number;
  body: EditApplyRequest;
}

export function useEditApplyMutation() {
  return useMutation({
    mutationFn: ({ applyId, body }: EditApplyVariables) => applyApi.editApply(applyId, body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applyQueries.all() }),
        queryClient.invalidateQueries({ queryKey: recruitQueries.all() }),
      ]);
      showToast(TOAST_CONTENT.applyEdited);
    },
    onError: (error) => {
      if (hasErrorCode(error, "APPLY-1")) {
        showToast(TOAST_CONTENT.applyAlreadyDeleted);
        return;
      }
      if (hasErrorCode(error, "RECRUIT-12")) {
        showToast(TOAST_CONTENT.updateConfirmedAppliesNotAllowed);
        return;
      }
      showToast(TOAST_CONTENT.editApplyFailed);
    },
  });
}
