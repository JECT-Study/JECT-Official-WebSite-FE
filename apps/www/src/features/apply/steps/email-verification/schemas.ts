import { z } from "zod";

import { emailSchema, pinSchema } from "@/features/apply/schemas";

export const authCodeSchema = z.string().trim().min(1, "인증번호를 입력해주세요.");

export const REQUIRED_TERMS = ["privacy", "paymentPolicy"] as const;

export const emailVerificationFormSchema = z.object({
  email: emailSchema,
  authCode: authCodeSchema,
  pin: pinSchema,
  agreedTerms: z
    .array(z.enum(REQUIRED_TERMS))
    .refine((terms) => REQUIRED_TERMS.every((term) => terms.includes(term))),
});

export type EmailVerificationFormValues = z.infer<typeof emailVerificationFormSchema>;
