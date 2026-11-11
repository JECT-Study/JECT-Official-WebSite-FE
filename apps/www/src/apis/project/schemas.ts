import type { components } from "@ject/api-types/core";
import { z } from "zod";

import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

export const projectSchema = z.object({
  id: z.number(),
  thumbnailUrl: z.string().nullable(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  serviceType: z.string(),
}) satisfies z.ZodType<NullableFields<Schemas["ProjectResponse"]>>;

interface ProjectPageResponse extends Omit<Schemas["PageProjectResponse"], "content"> {
  content?: NullableFields<Schemas["ProjectResponse"]>[];
}

export const projectPageSchema = z.object({
  content: z.array(projectSchema),
  number: z.number(),
  last: z.boolean(),
}) satisfies z.ZodType<ProjectPageResponse>;

export const projectSummarySchema = z.object({
  categorySummaries: z.array(z.object({ categoryName: z.string(), count: z.number() })),
}) satisfies z.ZodType<Schemas["ProjectSummaryResponse"]>;

export type Project = z.infer<typeof projectSchema>;
export type ProjectPage = z.infer<typeof projectPageSchema>;
export type ProjectSummary = z.infer<typeof projectSummarySchema>;
