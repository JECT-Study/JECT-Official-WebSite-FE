import { z } from "zod";

// z.email()로 시작하면 trim 전에 형식을 검사하므로, trim과 필수/길이 검사를 통과한 값만 pipe로 넘긴다.
const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력해주세요.")
  .max(255, "255자 이하로 입력해주세요.")
  .pipe(z.email("올바른 이메일 형식으로 입력해주세요."));

// 입력한 값을 그대로 제출하도록 trim하지 않고, 공백만 입력한 경우만 빈 값으로 본다.
const passwordSchema = z
  .string()
  .refine((value) => value.trim() !== "", { message: "비밀번호를 입력해주세요.", abort: true })
  .min(8, "8자 이상으로 입력해주세요.")
  .max(64, "64자 이하로 입력해주세요.");

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
