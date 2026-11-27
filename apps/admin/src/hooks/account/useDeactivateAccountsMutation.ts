import { hasErrorCode } from "@ject/api-client";
import { useMutation } from "@tanstack/react-query";

import { accountApi } from "@/apis/account/api";
import { accountMutationKeys, accountQueries } from "@/apis/account/queries";
import { queryClient } from "@/apis/queryClient";
import { TOAST_CONTENT } from "@/constants/toast";
import { showToast } from "@/utils/showToast";

function getDeactivateErrorToast(error: Error) {
  if (hasErrorCode(error, "GLOBAL-7")) return TOAST_CONTENT.deactivateForbidden;
  if (hasErrorCode(error, "ADMIN-10")) return TOAST_CONTENT.deactivateSelfNotAllowed;
  return TOAST_CONTENT.deactivateFailed;
}

export function useDeactivateAccountsMutation() {
  return useMutation({
    mutationKey: accountMutationKeys.deactivate(),
    mutationFn: accountApi.deactivateAccounts,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accountQueries.lists() });
      showToast(TOAST_CONTENT.accountsDeactivated);
    },
    onError: (error) => showToast(getDeactivateErrorToast(error)),
  });
}
