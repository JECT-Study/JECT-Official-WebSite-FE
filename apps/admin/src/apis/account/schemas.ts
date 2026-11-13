import type { components } from "@ject/api-types/admin";
import { z } from "zod";

import { ACCOUNT_ROLES, ACCOUNT_STATUSES } from "@/constants/account";

type Schemas = components["schemas"];

// 스펙에는 없지만 서버가 이름이 없는 계정에 null을 내려준다.
interface AccountResponse extends Omit<Schemas["AdminAccountResponse"], "name"> {
  name?: string | null;
}

interface AccountPageResponse extends Omit<Schemas["PageAdminAccountResponse"], "content"> {
  content?: AccountResponse[];
}

export const accountSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(ACCOUNT_ROLES),
  status: z.enum(ACCOUNT_STATUSES),
}) satisfies z.ZodType<AccountResponse>;

export const accountPageSchema = z.object({
  content: z.array(accountSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  number: z.number(),
}) satisfies z.ZodType<AccountPageResponse>;

export type Account = z.infer<typeof accountSchema>;
export type AccountPage = z.infer<typeof accountPageSchema>;
