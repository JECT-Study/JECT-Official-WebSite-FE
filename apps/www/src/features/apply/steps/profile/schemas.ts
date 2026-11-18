import { z } from "zod";

import {
  careerDetailsSchema,
  experiencePeriodSchema,
  interestedDomainSchema,
  regionSchema,
} from "@/apis/apply/schemas";

export const MAX_NAME_LENGTH = 5;

const NON_KOREAN_PATTERN = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g;

export function removeNonKorean(value: string) {
  return value.replace(NON_KOREAN_PATTERN, "");
}

export const nameSchema = z
  .string()
  .min(1)
  .max(MAX_NAME_LENGTH)
  .regex(/^[가-힣]+$/, "자음이나 모음만 입력할 수 없어요.");

export const phoneNumberSchema = z
  .string()
  .regex(/^010\d{8}$/, "올바른 휴대폰 번호를 입력해주세요.");

export const MAX_INTERESTED_DOMAINS = 3;

export const profileFormSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  careerDetails: careerDetailsSchema,
  region: regionSchema,
  experiencePeriod: experiencePeriodSchema,
  interestedDomains: z.array(interestedDomainSchema).min(1).max(MAX_INTERESTED_DOMAINS),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
