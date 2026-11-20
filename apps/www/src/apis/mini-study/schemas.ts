import type { components } from "@ject/api-types/core";
import { z } from "zod";

type Schemas = components["schemas"];

export const miniStudySchema = z.object({
  id: z.number(),
  name: z.string(),
  linkUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  summary: z.string(),
  tag: z.string(),
}) satisfies z.ZodType<Schemas["MiniStudyResponse"]>;

export const miniStudyPageSchema = z.object({
  content: z.array(miniStudySchema),
}) satisfies z.ZodType<Pick<Schemas["PageMiniStudyResponse"], "content">>;

export type MiniStudy = z.infer<typeof miniStudySchema>;
