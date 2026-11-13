import { useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";

import { accountApi } from "@/apis/account/api";
import { accountQueryKeys } from "@/apis/account/queryKeys";
import { queryClient } from "@/apis/queryClient";
import { hasErrorCode } from "@/errors/hasErrorCode";

function getDeactivateErrorMessage(error: Error) {
  if (hasErrorCode(error, "GLOBAL-7")) return "해당 기능을 수행할 권한이 없습니다.";
  if (hasErrorCode(error, "ADMIN-10")) return "본인 계정은 비활성화할 수 없습니다.";
  return "비활성화에 실패했습니다.";
}

export function useDeactivateAccountsMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: accountApi.deactivateAccounts,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.lists() });
      toast.positive("계정을 비활성화했습니다.");
    },
    onError: (error) => {
      toast.destructive(getDeactivateErrorMessage(error));
    },
  });
}
