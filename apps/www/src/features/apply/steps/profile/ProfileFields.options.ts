import type { CheckboxOption, SelectOption } from "@jects/jds";

import type {
  CareerDetails,
  ExperiencePeriod,
  InterestedDomain,
  Region,
} from "@/apis/apply/schemas";

interface ProfileSelectOption<T extends string> extends SelectOption {
  value: T;
}

interface InterestedDomainOption extends CheckboxOption {
  value: InterestedDomain;
}

export const CAREER_DETAILS_OPTIONS: ProfileSelectOption<CareerDetails>[] = [
  { value: "STUDENT", label: "대학생(재학/휴학)" },
  { value: "EXPECTED_GRADUATE", label: "대학 졸업 예정" },
  { value: "JOB_SEEKER", label: "취준생" },
  { value: "BETWEEN_JOBS", label: "이직 준비 중" },
  { value: "EMPLOYEE", label: "재직자" },
];

export const REGION_OPTIONS: ProfileSelectOption<Region>[] = [
  { value: "SEOUL", label: "서울" },
  { value: "GYEONGGI", label: "경기" },
  { value: "INCHEON", label: "인천" },
  { value: "BUSAN", label: "부산" },
  { value: "DAEGU", label: "대구" },
  { value: "DAEJEON", label: "대전" },
  { value: "GWANGJU", label: "광주" },
  { value: "ULSAN", label: "울산" },
  { value: "SEJONG", label: "세종" },
  { value: "GANGWON", label: "강원" },
  { value: "CHUNGBUK", label: "충북" },
  { value: "CHUNGNAM", label: "충남" },
  { value: "JEONBUK", label: "전북" },
  { value: "JEONNAM", label: "전남" },
  { value: "GYEONGBUK", label: "경북" },
  { value: "GYEONGNAM", label: "경남" },
  { value: "JEJU", label: "제주" },
  { value: "OVERSEAS", label: "해외" },
];

export const EXPERIENCE_PERIOD_OPTIONS: ProfileSelectOption<ExperiencePeriod>[] = [
  { value: "NONE", label: "경험 없음" },
  { value: "ONE_TO_TWO", label: "1~2년" },
  { value: "THREE_TO_FOUR", label: "3~4년" },
  { value: "FIVE_PLUS", label: "5년 이상" },
];

export const INTERESTED_DOMAIN_OPTIONS: InterestedDomainOption[] = [
  { value: "GAME", label: "게임" },
  { value: "EDUCATION", label: "교육" },
  { value: "MARKETING", label: "마케팅" },
  { value: "MOBILITY", label: "모빌리티" },
  { value: "PRODUCTIVITY", label: "생산성" },
  { value: "SOCIAL_NETWORK", label: "소셜 네트워크" },
  { value: "UTILITY", label: "유틸리티" },
  { value: "E_COMMERCE", label: "이커머스" },
  { value: "COMMUNITY", label: "커뮤니티" },
  { value: "CONTENTS", label: "콘텐츠" },
  { value: "TRAVELTECH", label: "트래블테크" },
  { value: "FASHION_BEAUTY", label: "패션/뷰티" },
  { value: "FOODTECH", label: "푸드테크" },
  { value: "PROPTECH", label: "프롭테크" },
  { value: "FINTECH", label: "핀테크" },
  { value: "HEALTHCARE", label: "헬스케어" },
  { value: "HR", label: "HR" },
];
