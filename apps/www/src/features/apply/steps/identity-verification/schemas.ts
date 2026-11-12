import { z } from "zod";

import { emailSchema, pinSchema } from "@/features/apply/schemas";

export const identityVerificationFormSchema = z.object({
  email: emailSchema,
  pin: pinSchema,
});

export type IdentityVerificationFormValues = z.infer<typeof identityVerificationFormSchema>;
