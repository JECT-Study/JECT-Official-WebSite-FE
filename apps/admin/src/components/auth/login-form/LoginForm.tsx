import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@ject/api-client";
import { type ErrorCode, isErrorCode } from "@ject/api-types/errors";
import { BlockButton, IconButton, TextField, useToast } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { authApi } from "@/apis/auth/api";
import { useAuthStore } from "@/stores/useAuthStore";

import { loginFormSchema, type LoginFormValues } from "./LoginForm.schema";

interface LoginErrorMessage {
  title: string;
  description: string;
}

const INVALID_CREDENTIALS_MESSAGE: LoginErrorMessage = {
  title: "로그인할 수 없어요",
  description: "이메일 또는 비밀번호를 확인해주세요.",
};

const DEFAULT_LOGIN_ERROR_MESSAGE: LoginErrorMessage = {
  title: "로그인에 실패했어요",
  description: "잠시 후 다시 시도해주세요.",
};

const LOGIN_ERROR_MESSAGES: Partial<Record<ErrorCode, LoginErrorMessage>> = {
  "ADMIN-1": INVALID_CREDENTIALS_MESSAGE,
  "ADMIN-6": INVALID_CREDENTIALS_MESSAGE,
  "ADMIN-5": { title: "계정이 비활성화됐어요", description: "관리자에게 문의해주세요." },
  "ADMIN-7": { title: "로그인 시도를 초과했어요", description: "잠시 후 다시 시도해주세요." },
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
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ isAdmin }) => useAuthStore.getState().login({ isAdmin }),
    onError: (error) => {
      const code = error instanceof ApiError && isErrorCode(error.status) ? error.status : null;
      const { title, description } =
        (code && LOGIN_ERROR_MESSAGES[code]) ?? DEFAULT_LOGIN_ERROR_MESSAGE;
      toast.destructive(title, { description });
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
