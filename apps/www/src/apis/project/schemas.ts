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

const projectImageSchema = z.object({
  imageUrl: z.string(),
  sequence: z.number(),
}) satisfies z.ZodType<Schemas["ProjectIntroResponse"]>;

export const projectDetailSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  // 직군이 추가되면 컴파일 에러로 드러나도록 모든 키를 필수로 대조한다.
  teamMemberNames: z.object({
    productManagers: z.array(z.string()),
    productDesigners: z.array(z.string()),
    frontendDevelopers: z.array(z.string()),
    backendDevelopers: z.array(z.string()),
  }) satisfies z.ZodType<Required<Schemas["TeamMemberNames"]>>,
  techStack: z.array(z.string()),
  badges: z.array(z.string()),
  description: z.string(),
  serviceUrl: z.string().nullable(),
  githubUrl: z.string().nullable(),
  bannerImageUrl: projectImageSchema.nullable(),
  sampleImageUrls: z.array(projectImageSchema),
  descriptionImageUrls: z.array(projectImageSchema),
}) satisfies z.ZodType<NullableFields<Schemas["ProjectDetailResponse"]>>;

export type ProjectDetail = z.infer<typeof projectDetailSchema>;
export type TeamMemberNames = ProjectDetail["teamMemberNames"];
export type ProjectImage = ProjectDetail["sampleImageUrls"][number];
