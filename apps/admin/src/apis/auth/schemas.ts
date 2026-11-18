import type { components } from "@ject/api-types/admin";
import { z } from "zod";

type Schemas = components["schemas"];

// 스펙에는 없지만 서버가 이름이 없는 계정에 null을 내려준다.
interface LoginResponseSpec extends Omit<Schemas["AdminLoginResponse"], "name"> {
  name?: string | null;
}

export const loginResponseSchema = z.object({
  name: z.string().nullable(),
  isAdmin: z.boolean(),
}) satisfies z.ZodType<LoginResponseSpec>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
