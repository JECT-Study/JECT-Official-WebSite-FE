import type { ReactNode } from "react";

import { PageLayout } from "@/components/layout";

export default function NarrowLayout({ children }: { children: ReactNode }) {
  return <PageLayout width="narrow">{children}</PageLayout>;
}
