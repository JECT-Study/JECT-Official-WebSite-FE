import type { TeamProjectEvent } from "@/constants/curriculum";

export function TeamProjectCard({ event }: { event: TeamProjectEvent }) {
  return (
    <div className="flex flex-col gap-12 rounded-4 border border-stroke-subtle bg-surface-shallow p-margin-sm">
      <p className="font-label text-label-lg font-label-subtle text-object-alternative">
        {event.date}
      </p>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <h2 className="font-title text-title-1 font-title-subtle text-object-boldest">
            {event.title}
          </h2>
          {event.isOptional && (
            <span className="font-body text-body-sm font-body-normal text-object-neutral">
              (선택 참여)
            </span>
          )}
        </div>
        <p className="font-body text-body-lg font-body-normal text-object-normal">
          {event.description}
        </p>
      </div>
    </div>
  );
}
