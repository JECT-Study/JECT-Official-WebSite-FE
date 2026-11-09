import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { applyApi } from "@/apis/apply/api";
import { applyMutationKeys } from "@/apis/apply/queryKeys";
import type { UploadedPortfolio } from "@/apis/apply/schemas";

export function useUploadPortfolioMutation(
  options?: Omit<UseMutationOptions<UploadedPortfolio, Error, File>, "mutationKey" | "mutationFn">
) {
  return useMutation({
    ...options,
    mutationKey: applyMutationKeys.uploadPortfolio,
    mutationFn: async (file) => {
      const [uploadUrl] = await applyApi.createPortfolioUploadUrls([
        { name: file.name, contentType: file.type, contentLength: file.size },
      ]);

      if (!uploadUrl) {
        throw new Error("업로드 주소를 발급받지 못했습니다.");
      }

      await applyApi.uploadToPresignedUrl(uploadUrl.presignedUrl, file);

      return { fileUrl: uploadUrl.cdnUrl, fileName: file.name, fileSize: String(file.size) };
    },
  });
}
