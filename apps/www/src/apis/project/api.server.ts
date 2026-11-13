import { httpClient } from "@/apis/httpClient/server";
import { pageableQuerySerializer } from "@/apis/pageable";

import { getProjectListQuery } from "./query";
import { projectPageSchema, projectSummarySchema } from "./schemas";

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
} as const;
