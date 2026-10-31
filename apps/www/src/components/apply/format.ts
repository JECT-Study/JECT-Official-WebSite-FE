import type { Recruit } from "@/apis/recruit/schemas";

function getJobFamilyName(recruitment: Pick<Recruit, "jobFamilyDescription">): string {
  return recruitment.jobFamilyDescription.replace(/\s*\([A-Z]+\)$/, "");
}

export function getRecruitTitle(
  recruitment: Pick<Recruit, "semesterName" | "jobFamilyDescription" | "recruitTypeDetail">
): string {
  const round = recruitment.recruitTypeDetail === "REGULAR" ? "모집" : "추가 모집";

  return `[젝트 ${recruitment.semesterName}] ${getJobFamilyName(recruitment)} ${round}`;
}
