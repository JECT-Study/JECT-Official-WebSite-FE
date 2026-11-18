import type { ThemeVariant } from "@jects/jds";

import type { JobFamily } from "@/apis/recruit/schemas";

interface JobFamilyBadge {
  label: string;
  color: ThemeVariant;
}

export const JOB_FAMILY_BADGES: Record<JobFamily, JobFamilyBadge> = {
  FE: { label: "프론트엔드 개발자", color: "green" },
  BE: { label: "백엔드 개발자", color: "sky" },
  APP: { label: "앱 개발자", color: "indigo" },
  PM: { label: "프로덕트 매니저", color: "orange" },
  PD: { label: "프로덕트 디자이너", color: "purple" },
  OPS: { label: "운영팀", color: "lime" },
  INFRA: { label: "인프라팀", color: "sky" },
  BX: { label: "BX팀", color: "purple" },
  ER: { label: "대외협력팀", color: "orange" },
};
