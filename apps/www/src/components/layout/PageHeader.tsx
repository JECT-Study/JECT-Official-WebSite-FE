import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-16 pt-margin-xl pb-margin-3xl", className)}>
      <h1 className="font-title text-title-5 font-title-bold text-object-boldest">{title}</h1>
      <p className="font-title text-title-1 font-title-subtle text-object-bold">{description}</p>
    </div>
  );
}
