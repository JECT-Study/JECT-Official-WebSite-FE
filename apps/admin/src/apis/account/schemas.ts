import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import { ACCOUNT_ROLES, ACCOUNT_STATUSES } from "@/constants/account";

type Schemas = components["schemas"];

export const accountSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.enum(ACCOUNT_ROLES),
  status: z.enum(ACCOUNT_STATUSES),
}) satisfies z.ZodType<Schemas["AdminAccountResponse"]>;

export const accountPageSchema = z.object({
  content: z.array(accountSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  number: z.number(),
}) satisfies z.ZodType<Schemas["PageAdminAccountResponse"]>;

export type Account = z.infer<typeof accountSchema>;
export type AccountPage = z.infer<typeof accountPageSchema>;
