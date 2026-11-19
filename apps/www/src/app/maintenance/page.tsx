import type { Metadata } from "next";

import { MaintenanceState } from "@/components/error";
import { createPageMetadata } from "@/constants/metadata";

export const metadata: Metadata = createPageMetadata({ title: "서비스 점검" });

export default function MaintenancePage() {
  return <MaintenanceState />;
}
