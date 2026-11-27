import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@ject/api-client";
import { type ErrorCode, isErrorCode } from "@ject/api-types/errors";
import { BlockButton, IconButton, TextField } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { authApi } from "@/apis/auth/api";
import { TOAST_CONTENT, type ToastContent } from "@/constants/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { showToast } from "@/utils/showToast";

import { loginFormSchema, type LoginFormValues } from "./LoginForm.schema";

const LOGIN_ERROR_TOASTS: Partial<Record<ErrorCode, ToastContent>> = {
  "ADMIN-1": TOAST_CONTENT.loginInvalidCredentials,
  "ADMIN-6": TOAST_CONTENT.loginInvalidCredentials,
  "ADMIN-5": TOAST_CONTENT.loginAccountDeactivated,
  "ADMIN-7": TOAST_CONTENT.loginAttemptsExceeded,
};

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ isAdmin }) => useAuthStore.getState().login({ isAdmin }),
    onError: (error) => {
      const code = error instanceof ApiError && isErrorCode(error.status) ? error.status : null;
      showToast((code && LOGIN_ERROR_TOASTS[code]) ?? TOAST_CONTENT.loginFailed);
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    if (isPending) return;
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-28">
      <div className="flex flex-col gap-20">
        <TextField status={errors.email ? "error" : "default"}>
          <TextField.Label>이메일</TextField.Label>
          <TextField.Input
            type="email"
            autoComplete="username"
            placeholder="name@ject.com"
            {...register("email")}
          />
          {errors.email && (
            <TextField.Footer>
              <TextField.Helper>{errors.email.message}</TextField.Helper>
            </TextField.Footer>
          )}
        </TextField>

        <TextField status={errors.password ? "error" : "default"}>
          <TextField.Label>비밀번호</TextField.Label>
          <TextField.Input
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요"
            action={
              <IconButton
                type="button"
                icon={isPasswordVisible ? "eye" : "eye-off"}
                size="md"
                hierarchy="tertiary"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
            }
            {...register("password")}
          />
          {errors.password && (
            <TextField.Footer>
              <TextField.Helper>{errors.password.message}</TextField.Helper>
            </TextField.Footer>
          )}
        </TextField>
      </div>

      <BlockButton type="submit" size="lg" disabled={isPending}>
        로그인
      </BlockButton>
    </form>
  );
}
