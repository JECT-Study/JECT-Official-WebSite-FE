interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-16 pt-margin-xl pb-margin-3xl">
      <h1 className="font-title text-title-5 font-title-bold text-object-boldest">{title}</h1>
      <p className="font-title text-title-1 font-title-subtle text-object-bold">{description}</p>
    </div>
  );
}
