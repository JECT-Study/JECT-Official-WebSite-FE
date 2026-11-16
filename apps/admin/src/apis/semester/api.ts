import { httpClient } from "@/apis/httpClient";

import { semestersSchema } from "./schemas";

export const semesterApi = {
  getSemesters: async () => {
    const { data } = await httpClient.GET("/semesters");

    return semestersSchema.parse(data);
  },
} as const;
