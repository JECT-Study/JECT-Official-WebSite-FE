import { z } from "zod";

import {
  careerDetailsSchema,
  experiencePeriodSchema,
  interestedDomainSchema,
  regionSchema,
} from "@/apis/apply/schemas";

export const MAX_NAME_LENGTH = 5;

const KOREAN_CHARACTERS = "ㄱ-ㅎㅏ-ㅣ가-힣";

const NON_KOREAN_PATTERN = new RegExp(`[^${KOREAN_CHARACTERS}]`, "g");

export function removeNonKorean(value: string) {
  return value.replace(NON_KOREAN_PATTERN, "");
}

export const nameSchema = z
  .string()
  .min(1)
  .max(MAX_NAME_LENGTH)
  .regex(new RegExp(`^[${KOREAN_CHARACTERS}]+$`));

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
