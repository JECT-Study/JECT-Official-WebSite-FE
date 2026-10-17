import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-32 pt-margin-xl pb-margin-3xl">
      <div className="flex flex-col gap-16">
        <h1 className="font-title text-title-5 font-title-bold text-object-boldest">{title}</h1>
        <p className="font-title text-title-1 font-title-subtle text-object-bold">{description}</p>
      </div>
      {children}
    </div>
  );
}
