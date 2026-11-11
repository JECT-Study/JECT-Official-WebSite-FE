import { httpClient } from "@/apis/httpClient/client";

import { getProjectListQuery, projectListQuerySerializer } from "./query";
import { projectPageSchema } from "./schemas";

export const projectApi = {
  getProjects: async (category: string | null, page: number) => {
    const { data } = await httpClient.GET("/projects", {
      params: { query: getProjectListQuery(category, page) },
      querySerializer: projectListQuerySerializer,
    });

    return projectPageSchema.parse(data);
  },
} as const;
