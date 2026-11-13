import type { components } from "@ject/api-types/admin";
import { z } from "zod";

type Schemas = components["schemas"];

export const loginResponseSchema = z.object({
  name: z.string(),
  isAdmin: z.boolean(),
}) satisfies z.ZodType<Schemas["AdminLoginResponse"]>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;
