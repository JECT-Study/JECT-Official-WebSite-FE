import type { components } from "@ject/api-types/admin";
import { z } from "zod";

type Schemas = components["schemas"];

export const localDateTimeSchema = z.iso
  // 서버는 시간대 표기가 없는 LocalDateTime을 반환한다.
  .datetime({ local: true })
  // local 옵션은 Z로 끝나는 값도 허용하므로 별도로 처리한다.
  .refine((value) => !value.endsWith("Z"));

// 서버에서 사용하지 않는 SUPPORTER는 제외한다.
export const jobFamilySchema = z.enum([
  "PM",
  "PD",
  "FE",
  "BE",
  "APP",
  "OPS",
  "INFRA",
  "BX",
  "ER",
]) satisfies z.ZodType<Schemas["JobFamily"]>;

export type JobFamily = z.infer<typeof jobFamilySchema>;
