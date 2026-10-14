import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const WIDTH_CLASS = {
  content: "max-w-content",
  narrow: "max-w-narrow",
} as const;

interface PageLayoutProps {
  width: keyof typeof WIDTH_CLASS;
  children: ReactNode;
}

export function PageLayout({ width, children }: PageLayoutProps) {
  return (
    <div className="flex justify-center px-margin-lg pt-[calc(var(--gnb-height)+var(--spacing-margin-2xl))] pb-margin-2xl">
      <div className={cn("flex w-full flex-col pb-80", WIDTH_CLASS[width])}>{children}</div>
    </div>
  );
}
