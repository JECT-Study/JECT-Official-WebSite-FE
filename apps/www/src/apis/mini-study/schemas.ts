import type { components } from "@ject/api-types/core";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

export const miniStudySchema = z.object({
  id: z.number(),
  name: z.string(),
  linkUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  summary: z.string(),
  tag: z.string(),
}) satisfies z.ZodType<NullableFields<Schemas["MiniStudyResponse"]>>;

interface MiniStudyPageResponse extends Omit<Schemas["PageMiniStudyResponse"], "content"> {
  content?: NullableFields<Schemas["MiniStudyResponse"]>[];
}

export const miniStudyPageSchema = z.object({
  content: z.array(miniStudySchema),
}) satisfies z.ZodType<MiniStudyPageResponse>;

export type MiniStudy = z.infer<typeof miniStudySchema>;
