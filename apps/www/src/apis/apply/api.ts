import type { components } from "@ject/api-types/core";

import { httpClient } from "@/apis/httpClient/client";
import { API_ENDPOINTS } from "@/constants/endpoints";

import { portfolioUploadUrlsSchema, questionsSchema, tempApplicationSchema } from "./schemas";

type Schemas = components["schemas"];

function withRecruitId(endpoint: string, recruitId: number) {
  return `${endpoint}?${new URLSearchParams({ recruitId: String(recruitId) })}`;
}

export const applyApi = {
  saveProfile: (recruitId: number, request: Schemas["ApplyProfileRequest"]) =>
    httpClient.post(withRecruitId(API_ENDPOINTS.applyProfile, recruitId), request),

  getQuestions: (recruitId: number) =>
    httpClient.get(withRecruitId(API_ENDPOINTS.applyQuestions, recruitId), questionsSchema),

  getTempApplication: (recruitId: number) =>
    httpClient.get(withRecruitId(API_ENDPOINTS.applyTemp, recruitId), tempApplicationSchema),

  saveTempApplication: (recruitId: number, request: Schemas["ApplyTemporaryRequest"]) =>
    httpClient.post(withRecruitId(API_ENDPOINTS.applyTemp, recruitId), request),

  submitApplication: (recruitId: number, request: Schemas["SubmitApplicationRequest"]) =>
    httpClient.post(withRecruitId(API_ENDPOINTS.applySubmit, recruitId), request),

  createPortfolioUploadUrls: (files: Schemas["UploadFileRequest"][]) =>
    httpClient.post(API_ENDPOINTS.uploadPortfolios, files, portfolioUploadUrlsSchema),

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
