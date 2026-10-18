"use client";

import type { ReactNode } from "react";

import { Accordion } from "@jects/jds";

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
    <Accordion.Root type="single" size="sm" isStretched={false} collapsible className={className}>
      <Accordion.Item value="content">
        <Accordion.Trigger withPrefixIcon="info">{title}</Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
