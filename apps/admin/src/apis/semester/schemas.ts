import type { components } from "@ject/api-types/core";
import { z } from "zod";

type Schemas = components["schemas"];

const semesterSchema = z.object({
  id: z.number(),
  name: z.string(),
}) satisfies z.ZodType<Schemas["SemesterResponse"]>;

export const semestersSchema = z
  .object({ semesterResponses: z.array(semesterSchema) })
  .transform(({ semesterResponses }) => semesterResponses);

export type Semester = z.infer<typeof semesterSchema>;
