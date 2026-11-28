import { pageableQuerySerializer } from "@ject/api-client";

import { httpClient } from "@/apis/httpClient/server";

import { getProjectListQuery } from "./queryParams";
import { projectDetailSchema, projectPageSchema, projectSummarySchema } from "./schemas";

export const projectServerApi = {
  getProjects: async (category: string | null, page: number) => {
    const { data } = await httpClient.GET("/projects", {
      params: { query: getProjectListQuery(category, page) },
      querySerializer: pageableQuerySerializer,
      credentials: "omit",
    });

    return projectPageSchema.parse(data);
  },

  getSummary: async () => {
    const { data } = await httpClient.GET("/projects/summary", { credentials: "omit" });

    return projectSummarySchema.parse(data);
  },

  getProject: async (projectId: number) => {
    const { data } = await httpClient.GET("/projects/{projectId}", {
      params: { path: { projectId } },
      credentials: "omit",
    });

    return projectDetailSchema.parse(data);
  },
} as const;
