import type { ReactNode } from "react";

import { PageLayout } from "@/components/layout";

export default function ContentLayout({ children }: { children: ReactNode }) {
  return <PageLayout width="content">{children}</PageLayout>;
}
