import type { CheckboxOption, SelectOption } from "@jects/jds";

import {
  type CareerDetails,
  careerDetailsSchema,
  type ExperiencePeriod,
  experiencePeriodSchema,
  type InterestedDomain,
  interestedDomainSchema,
  type Region,
  regionSchema,
} from "@/apis/apply/schemas";
import { toOptions } from "@/utils/toOptions";

const CAREER_DETAILS_LABELS = {
  STUDENT: "대학생(재학/휴학)",
  EXPECTED_GRADUATE: "대학 졸업 예정",
  JOB_SEEKER: "취준생",
  BETWEEN_JOBS: "이직 준비 중",
  EMPLOYEE: "재직자",
} satisfies Record<CareerDetails, string>;

const REGION_LABELS = {
  SEOUL: "서울",
  GYEONGGI: "경기",
  INCHEON: "인천",
  BUSAN: "부산",
  DAEGU: "대구",
  DAEJEON: "대전",
  GWANGJU: "광주",
  ULSAN: "울산",
  SEJONG: "세종",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
  OVERSEAS: "해외",
} satisfies Record<Region, string>;

const EXPERIENCE_PERIOD_LABELS = {
  NONE: "경험 없음",
  ONE_TO_TWO: "1~2년",
  THREE_TO_FOUR: "3~4년",
  FIVE_PLUS: "5년 이상",
} satisfies Record<ExperiencePeriod, string>;

const INTERESTED_DOMAIN_LABELS = {
  GAME: "게임",
  EDUCATION: "교육",
  MARKETING: "마케팅",
  MOBILITY: "모빌리티",
  PRODUCTIVITY: "생산성",
  SOCIAL_NETWORK: "소셜 네트워크",
  UTILITY: "유틸리티",
  E_COMMERCE: "이커머스",
  COMMUNITY: "커뮤니티",
  CONTENTS: "콘텐츠",
  TRAVELTECH: "트래블테크",
  FASHION_BEAUTY: "패션/뷰티",
  FOODTECH: "푸드테크",
  PROPTECH: "프롭테크",
  FINTECH: "핀테크",
  HEALTHCARE: "헬스케어",
  HR: "HR",
} satisfies Record<InterestedDomain, string>;

export const CAREER_DETAILS_OPTIONS = toOptions(
  careerDetailsSchema.options,
  CAREER_DETAILS_LABELS
) satisfies SelectOption[];

export const REGION_OPTIONS = toOptions(
  regionSchema.options,
  REGION_LABELS
) satisfies SelectOption[];

export const EXPERIENCE_PERIOD_OPTIONS = toOptions(
  experiencePeriodSchema.options,
  EXPERIENCE_PERIOD_LABELS
) satisfies SelectOption[];

export const INTERESTED_DOMAIN_OPTIONS = toOptions(
  interestedDomainSchema.options,
  INTERESTED_DOMAIN_LABELS
) satisfies CheckboxOption[];
