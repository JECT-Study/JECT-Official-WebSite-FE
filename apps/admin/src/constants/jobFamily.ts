import type { components } from "@ject/api-types/admin";
import type { ThemeVariant } from "@jects/jds";

export type JobFamily = components["schemas"]["JobFamily"];

interface JobFamilyBadge {
  label: string;
  color: ThemeVariant;
}

export const JOB_FAMILY_BADGES: Partial<Record<JobFamily, JobFamilyBadge>> = {
  FE: { label: "프론트엔드 개발자", color: "green" },
  BE: { label: "백엔드 개발자", color: "sky" },
  APP: { label: "앱 개발자", color: "indigo" },
  PM: { label: "프로덕트 매니저", color: "orange" },
  PD: { label: "프로덕트 디자이너", color: "purple" },
  OPS: { label: "운영팀", color: "lime" },
  // TODO: JDS에 blue, fuchsia가 추가되면 INFRA, BX의 색을 수정한다. 지금은 가장 가까운 sky, purple을 사용한다.
  INFRA: { label: "인프라팀", color: "sky" },
  BX: { label: "BX팀", color: "purple" },
  ER: { label: "대외협력팀", color: "orange" },
};
