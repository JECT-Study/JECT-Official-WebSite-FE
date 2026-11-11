import type { ReactNode } from "react";

import { Phrases } from "@/components/common/phrases";

interface SectionHeadingProps {
  label: ReactNode;
  titlePhrases: string[];
}

export function SectionHeading({ label, titlePhrases }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-16">
      <p className="font-title text-title-1 font-title-subtle text-object-bolder">{label}</p>
      <h2 className="font-title text-title-3 font-title-normal text-object-boldest">
        <Phrases phrases={titlePhrases} />
      </h2>
    </div>
  );
}
