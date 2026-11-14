import type { components } from "@ject/api-types/core";

import { httpClient } from "@/apis/httpClient/client";

import {
  applyStatusResponseSchema,
  portfolioUploadUrlsSchema,
  questionsSchema,
  tempApplicationSchema,
} from "./schemas";

type Schemas = components["schemas"];

export const applyApi = {
  saveProfile: async (recruitId: number, request: Schemas["ApplyProfileRequest"]) => {
    await httpClient.POST("/apply/profile", {
      params: { query: { recruitId } },
      body: request,
    });
  },

  getApplyStatus: async (recruitId: number) => {
    const { data } = await httpClient.GET("/apply/status", {
      params: { query: { recruitId } },
    });

    return applyStatusResponseSchema.parse(data).status;
  },

  getQuestions: async (recruitId: number) => {
    const { data } = await httpClient.GET("/apply/questions", {
      params: { query: { recruitId } },
    });

    return questionsSchema.parse(data);
  },

  getTempApplication: async (recruitId: number) => {
    const { data } = await httpClient.GET("/apply/temp", {
      params: { query: { recruitId } },
    });

    return tempApplicationSchema.parse(data);
  },

  saveTempApplication: async (recruitId: number, request: Schemas["ApplyTemporaryRequest"]) => {
    await httpClient.POST("/apply/temp", {
      params: { query: { recruitId } },
      body: request,
    });
  },

  submitApplication: async (recruitId: number, request: Schemas["SubmitApplicationRequest"]) => {
    await httpClient.POST("/apply/submit", {
      params: { query: { recruitId } },
      body: request,
    });
  },

  createPortfolioUploadUrls: async (files: Schemas["UploadFileRequest"][]) => {
    const { data } = await httpClient.POST("/upload/portfolios", {
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
