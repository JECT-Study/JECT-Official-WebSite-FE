import type { components } from "@ject/api-types/core";
import { z } from "zod";

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
