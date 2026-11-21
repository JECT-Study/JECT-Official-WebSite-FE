import { z } from "zod";

import { authCodeSchema, emailSchema, pinSchema } from "@/features/apply/schemas";

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
