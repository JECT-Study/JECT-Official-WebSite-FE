import { zodResolver } from "@hookform/resolvers/zod";
import { BlockButton, IconButton, TextField } from "@jects/jds";
import { useForm } from "react-hook-form";

import { loginFormSchema, type LoginFormValues } from "./LoginForm.schema";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (_values: LoginFormValues) => {};

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
          <TextField status={errors.password ? "error" : "default"} className="flex-1">
            <TextField.Label>비밀번호</TextField.Label>
            <TextField.Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              {...register("password")}
            />
            {errors.password && (
              <TextField.Footer>
                <TextField.Helper>{errors.password.message}</TextField.Helper>
              </TextField.Footer>
            )}
          </TextField>
          <div className="mt-[22px] flex h-[42px] items-center self-start">
            <IconButton type="button" icon="eye-off" size="lg" hierarchy="tertiary" />
          </div>
        </div>
      </div>

      <BlockButton type="submit" size="lg">
        로그인
      </BlockButton>
    </form>
  );
}
