import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { BlockButton, IconButton, TextField } from "@jects/jds";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/apis/auth/api";
import { routeTo } from "@/constants/routes";

import { loginFormSchema, type LoginFormValues } from "./LoginForm.schema";

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
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => navigate(routeTo.home(), { replace: true }),
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
          <TextField.Input type="email" placeholder="name@ject.com" {...register("email")} />
          {errors.email && (
            <TextField.Footer>
              <TextField.Helper>{errors.email.message}</TextField.Helper>
            </TextField.Footer>
          )}
        </TextField>

        <div className="flex gap-10">
          <TextField status={errors.password ? "error" : "default"} className="min-w-0 flex-1">
            <TextField.Label>비밀번호</TextField.Label>
            <TextField.Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              {...register("password")}
            />
            {errors.password && (
              <TextField.Footer>
                <TextField.Helper>{errors.password.message}</TextField.Helper>
              </TextField.Footer>
            )}
          </TextField>
          {/* TODO: JDS 0.8.0 입력 영역 높이(42px)에 맞춘 값이다. 다음 버전으로 올리면 Figma와 같은 36px로 바꾼다. */}
          <div className="mt-[22px] flex h-[42px] items-center self-start">
            <IconButton
              type="button"
              icon={isPasswordVisible ? "eye" : "eye-off"}
              size="lg"
              hierarchy="tertiary"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      <BlockButton type="submit" size="lg">
        로그인
      </BlockButton>
    </form>
  );
}
