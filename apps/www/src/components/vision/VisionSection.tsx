import type { ReactNode } from "react";

import { SectionHeading } from "./SectionHeading";

interface VisionSectionProps {
  label: ReactNode;
  titlePhrases: string[];
  paragraphs: string[];
}

export function VisionSection({ label, titlePhrases, paragraphs }: VisionSectionProps) {
  return (
    <section className="flex flex-col gap-16">
      <SectionHeading label={label} titlePhrases={titlePhrases} />
      <div className="flex flex-col gap-8 font-body text-body-lg font-body-bold text-object-normal">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
