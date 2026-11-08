"use client";

import type { ReactNode } from "react";

import { Tabs } from "@jects/jds";

export interface CurriculumTab {
  value: string;
  label: string;
  className: string;
  content: ReactNode;
}

export function CurriculumTabs({ tabs }: { tabs: CurriculumTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} className="flex flex-col gap-48">
      <Tabs.List aria-label="커리큘럼">
        {tabs.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(({ value, className, content }) => (
        <Tabs.Content key={value} value={value} className={className}>
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
