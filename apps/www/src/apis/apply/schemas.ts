import type { components } from "@ject/api-types/core";
import { z } from "zod";

import { jobFamilySchema } from "@/apis/recruit/schemas";
import type { NullableFields } from "@/apis/types";

type Schemas = components["schemas"];

export const careerDetailsSchema = z.enum([
  "STUDENT",
  "EXPECTED_GRADUATE",
  "JOB_SEEKER",
  "BETWEEN_JOBS",
  "EMPLOYEE",
]) satisfies z.ZodType<Schemas["CareerDetails"]>;

export const regionSchema = z.enum([
  "SEOUL",
  "GYEONGGI",
  "INCHEON",
  "BUSAN",
  "DAEGU",
  "DAEJEON",
  "GWANGJU",
  "ULSAN",
  "SEJONG",
  "GANGWON",
  "CHUNGBUK",
  "CHUNGNAM",
  "JEONBUK",
  "JEONNAM",
  "GYEONGBUK",
  "GYEONGNAM",
  "JEJU",
  "OVERSEAS",
]) satisfies z.ZodType<Schemas["Region"]>;

export const experiencePeriodSchema = z.enum([
  "NONE",
  "ONE_TO_TWO",
  "THREE_TO_FOUR",
  "FIVE_PLUS",
]) satisfies z.ZodType<Schemas["ExperiencePeriod"]>;

// 스펙에는 string[]으로만 정의되어 있어 서버 InterestedDomain enum의 값을 옮겨 적는다.
export const interestedDomainSchema = z.enum([
  "GAME",
  "EDUCATION",
  "MARKETING",
  "MOBILITY",
  "PRODUCTIVITY",
  "SOCIAL_NETWORK",
  "UTILITY",
  "E_COMMERCE",
  "COMMUNITY",
  "CONTENTS",
  "TRAVELTECH",
  "FASHION_BEAUTY",
  "FOODTECH",
  "PROPTECH",
  "FINTECH",
  "HEALTHCARE",
  "HR",
]);

export type CareerDetails = z.infer<typeof careerDetailsSchema>;
export type Region = z.infer<typeof regionSchema>;
export type ExperiencePeriod = z.infer<typeof experiencePeriodSchema>;
export type InterestedDomain = z.infer<typeof interestedDomainSchema>;

export const questionSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  inputType: z.enum(["SELECT", "TEXT", "URL", "FILE"]),
  isRequired: z.boolean(),
  title: z.string(),
  subtitle: z.string().nullable(),
  label: z.string().nullable(),
  selectOptions: z.array(z.string()).nullable(),
  inputHint: z.string().nullable(),
  maxTextLength: z.number().nullable(),
  maxFileSize: z.number().nullable(),
}) satisfies z.ZodType<NullableFields<Schemas["QuestionResponse"]>>;

export const questionsSchema = z.object({
  questionResponses: z.array(questionSchema),
});

export const portfolioSchema = z.object({
  fileUrl: z.string(),
  fileName: z.string(),
  fileSize: z.string(),
  sequence: z.string(),
}) satisfies z.ZodType<Schemas["ApplyPortfolioDto"]>;

export const uploadedPortfolioSchema = portfolioSchema.omit({ sequence: true });

export const tempApplicationSchema = z.object({
  jobFamily: jobFamilySchema,
  answers: z.record(z.string(), z.string()),
  portfolios: z.array(portfolioSchema),
}) satisfies z.ZodType<Schemas["TempApplicationFormResponse"]>;

export const portfolioUploadUrlsSchema = z.array(
  z.object({
    cdnUrl: z.string(),
    presignedUrl: z.string(),
    expiration: z.string(),
  }) satisfies z.ZodType<Schemas["UploadFileResponse"]>
);

export type Question = z.infer<typeof questionSchema>;
export type UploadedPortfolio = z.infer<typeof uploadedPortfolioSchema>;
export type TempApplication = z.infer<typeof tempApplicationSchema>;
