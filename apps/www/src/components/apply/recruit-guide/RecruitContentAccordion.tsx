import type { ReactNode } from "react";

import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from "@jects/jds";

interface RecruitContentAccordionProps {
  title: string;
  className?: string;
  children: ReactNode;
}

export function RecruitContentAccordion({
  title,
  className,
  children,
}: RecruitContentAccordionProps) {
  return (
    <AccordionRoot type="single" size="sm" isStretched={false} collapsible className={className}>
      <AccordionItem value="content">
        <AccordionTrigger withPrefixIcon="info">{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
