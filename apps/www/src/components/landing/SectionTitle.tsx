import { Phrases } from "@/components/common/phrases";

interface SectionTitleProps {
  as?: "h1" | "h2";
  phrases: string[];
}

export function SectionTitle({ as: Heading = "h2", phrases }: SectionTitleProps) {
  return (
    <Heading className="font-title text-title-5 font-title-subtle text-object-boldest">
      <Phrases phrases={phrases} />
    </Heading>
  );
}
