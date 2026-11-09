import type { components } from "@ject/api-types/core";

import { httpClient } from "@/apis/httpClient/client";

import { portfolioUploadUrlsSchema, questionsSchema, tempApplicationSchema } from "./schemas";

type Schemas = components["schemas"];

function applicantQuery(recruitId: number) {
  // TODO: 서버가 토큰에서 주입하는 applicantId가 스펙의 쿼리에서 제외되면 단언을 제거한다.
  return { recruitId } as { applicantId: number; recruitId: number };
}

export const applyApi = {
  saveProfile: async (recruitId: number, request: Schemas["ApplyProfileRequest"]) => {
    await httpClient.POST("/apply/profile", {
      params: { query: applicantQuery(recruitId) },
      body: request,
    });
  },

  getQuestions: async (recruitId: number) => {
    const { data } = await httpClient.GET("/apply/questions", {
      params: { query: { recruitId } },
    });

    return questionsSchema.parse(data);
  },

  getTempApplication: async (recruitId: number) => {
    const { data } = await httpClient.GET("/apply/temp", {
      params: { query: applicantQuery(recruitId) },
    });

    return tempApplicationSchema.parse(data);
  },

  saveTempApplication: async (recruitId: number, request: Schemas["ApplyTemporaryRequest"]) => {
    await httpClient.POST("/apply/temp", {
      params: { query: applicantQuery(recruitId) },
      body: request,
    });
  },

  submitApplication: async (recruitId: number, request: Schemas["SubmitApplicationRequest"]) => {
    await httpClient.POST("/apply/submit", {
      params: { query: applicantQuery(recruitId) },
      body: request,
    });
  },

  createPortfolioUploadUrls: async (files: Schemas["UploadFileRequest"][]) => {
    const { data } = await httpClient.POST("/upload/portfolios", {
      // TODO: 서버가 토큰에서 주입하는 memberId가 스펙의 쿼리에서 제외되면 단언을 제거한다.
      params: { query: {} as { memberId: number } },
      body: files,
    });

    return portfolioUploadUrlsSchema.parse(data);
  },

  // 발급받은 S3 주소로 직접 업로드하므로 API 서버용 httpClient를 거치지 않는다.
  uploadToPresignedUrl: async (url: string, file: File) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`파일 업로드에 실패했습니다. (${response.status})`);
    }
  },
} as const;
