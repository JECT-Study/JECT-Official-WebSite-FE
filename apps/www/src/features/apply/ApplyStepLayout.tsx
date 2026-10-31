import type { ReactNode } from "react";

interface ApplyStepLayoutProps {
  title: string;
  children: ReactNode;
}

export function ApplyStepLayout({ title, children }: ApplyStepLayoutProps) {
  return (
    <section className="flex flex-col gap-margin-3xl">
      <h1 className="font-title text-title-4 font-title-normal text-object-boldest">{title}</h1>
      {children}
    </section>
  );
}
