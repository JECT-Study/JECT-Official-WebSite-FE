"use client";

import type { ReactNode } from "react";

import { Tabs } from "@jects/jds";

export interface MemberTab {
  value: string;
  label: string;
  className: string;
  content: ReactNode;
}

export function MemberTabs({ tabs }: { tabs: MemberTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} className="flex flex-col gap-24">
      <Tabs.List aria-label="구성원">
        {tabs.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value} className="max-tablet:flex-1">
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
