import type { Recruit } from "@/apis/recruit/schemas";

export function getJobFamilyName(recruitment: Pick<Recruit, "jobFamilyDescription">): string {
  return recruitment.jobFamilyDescription.replace(/\s*\([A-Z]+\)$/, "");
}
