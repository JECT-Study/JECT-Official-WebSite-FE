import type { ActiveRecruitment } from "@/apis/recruit/schemas";

function getJobFamilyName(recruitment: ActiveRecruitment): string {
  return recruitment.jobFamilyDescription.replace(/\s*\([A-Z]+\)$/, "");
}

export function getRecruitTitle(recruitment: ActiveRecruitment): string {
  const round = recruitment.recruitTypeDetail === "REGULAR" ? "모집" : "추가 모집";

  return `[젝트 ${recruitment.semesterName}] ${getJobFamilyName(recruitment)} ${round}`;
}
