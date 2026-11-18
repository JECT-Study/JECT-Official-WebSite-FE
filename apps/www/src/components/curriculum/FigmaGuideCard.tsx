import type { FigmaGuideChapter } from "@/constants/curriculum";

interface FigmaGuideCardProps {
  order: number;
  chapter: FigmaGuideChapter;
}

export function FigmaGuideCard({ order, chapter }: FigmaGuideCardProps) {
  return (
    <div className="flex flex-col gap-8 rounded-4 border border-stroke-subtle bg-surface-shallow p-margin-sm">
      <h2 className="font-title text-title-1 font-title-subtle text-object-boldest">
        {order}. {chapter.title}
      </h2>
      <ul className="list-disc ps-24 font-body text-body-lg font-body-normal text-object-normal">
        {chapter.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}
