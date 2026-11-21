import { z } from "zod";

import { authCodeSchema, emailSchema, pinSchema } from "@/features/apply/schemas";

export const resetPinFormSchema = z.object({
  email: emailSchema,
  authCode: authCodeSchema,
  pin: pinSchema,
});

export type ResetPinFormValues = z.infer<typeof resetPinFormSchema>;
