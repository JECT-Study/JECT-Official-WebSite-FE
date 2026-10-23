"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { Accordion, Tabs } from "@jects/jds";

const TABS = [
  { value: "info", label: "모집 정보" },
  { value: "notice", label: "안내사항" },
  { value: "faq", label: "FAQ" },
] as const;

const BODY_TEXT = "font-body text-body-md font-body-normal text-object-bold";

type TabValue = (typeof TABS)[number]["value"];

function parseTabParam(param: string | null): TabValue {
  return TABS.find((tab) => tab.value === param)?.value ?? "info";
}

function replaceSearchParams(update: (params: URLSearchParams) => void) {
  const params = new URLSearchParams(window.location.search);
  update(params);
  window.history.replaceState(null, "", `?${params.toString()}`);
}

export interface RecruitFaq {
  title: string;
  content: ReactNode;
}

interface RecruitGuideTabsProps {
  information: ReactNode;
  notice: ReactNode;
  faqs: RecruitFaq[];
}

export function RecruitGuideTabs({ information, notice, faqs }: RecruitGuideTabsProps) {
  const searchParams = useSearchParams();

  const tab = parseTabParam(searchParams.get("tab"));
  const openFaq = searchParams.get("faq") ?? "";

  const handleTabChange = (value: string) => {
    replaceSearchParams((params) => {
      params.set("tab", value);
      params.delete("faq");
    });
  };

  const handleFaqChange = (value: string) => {
    replaceSearchParams((params) => {
      if (value) {
        params.set("faq", value);
      } else {
        params.delete("faq");
      }
    });
  };

  return (
    <Tabs.Root value={tab} onValueChange={handleTabChange} className="flex flex-col gap-48">
      <Tabs.List aria-label="공고 내용">
        {TABS.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value="info" className={BODY_TEXT}>
        {information}
      </Tabs.Content>
      <Tabs.Content value="notice" className={BODY_TEXT}>
        {notice}
      </Tabs.Content>
      <Tabs.Content value="faq">
        <Accordion.Root
          type="single"
          size="lg"
          isStretched
          collapsible
          value={openFaq}
          onValueChange={handleFaqChange}
        >
          {faqs.map((faq, index) => (
            <Accordion.Item key={index} value={`faq-${index + 1}`}>
              <Accordion.Trigger>{faq.title}</Accordion.Trigger>
              <Accordion.Content>{faq.content}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Tabs.Content>
    </Tabs.Root>
  );
}
