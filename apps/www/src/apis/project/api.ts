import { httpClient } from "@/apis/httpClient/client";
import { pageableQuerySerializer } from "@/apis/pageable";

import { getProjectListQuery } from "./queryParams";
import { projectPageSchema } from "./schemas";

export const projectApi = {
  getProjects: async (category: string | null, page: number) => {
    const { data } = await httpClient.GET("/projects", {
      params: { query: getProjectListQuery(category, page) },
      querySerializer: pageableQuerySerializer,
    });

    return projectPageSchema.parse(data);
  },
} as const;
