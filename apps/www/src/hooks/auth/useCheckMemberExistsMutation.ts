import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authApi } from "@/apis/auth/api";

interface CheckMemberExistsVariables {
  email: string;
  recruitId: number;
}

export function useCheckMemberExistsMutation(
  options?: Omit<UseMutationOptions<boolean, Error, CheckMemberExistsVariables>, "mutationFn">
) {
  return useMutation({
    ...options,
    mutationFn: ({ email, recruitId }) => authApi.isExistMember(email, recruitId),
  });
}
