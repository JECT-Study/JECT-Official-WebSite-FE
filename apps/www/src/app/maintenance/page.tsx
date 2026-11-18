import type { Metadata } from "next";

import { MaintenanceState } from "@/components/error";

export const metadata: Metadata = {
  title: "서비스 점검",
};

export default function MaintenancePage() {
  return <MaintenanceState />;
}
