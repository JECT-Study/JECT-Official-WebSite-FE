"use client";

import { useState } from "react";

import { Accordion, Tabs } from "@jects/jds";

import type { FaqCategory } from "@/constants/faq";
import { routeTo } from "@/constants/routes";

interface FaqTabsProps {
  categories: FaqCategory[];
  initialCategoryId: string;
  initialQuestionId?: string;
}

export function FaqTabs({ categories, initialCategoryId, initialQuestionId }: FaqTabsProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [openQuestionId, setOpenQuestionId] = useState(initialQuestionId ?? "");

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setOpenQuestionId("");
    // 정적 페이지를 다시 요청하지 않도록 router 대신 history API로 URL만 변경한다.
    window.history.replaceState(
      null,
      "",
      value === categories[0]?.id ? routeTo.faq() : routeTo.faq(value)
    );
  };

  return (
    <Tabs.Root
      value={categoryId}
      onValueChange={handleCategoryChange}
      className="flex flex-col gap-48"
    >
      <Tabs.List aria-label="FAQ 분류">
        {categories.map(({ id, label }) => (
          <Tabs.Trigger key={id} value={id} className="max-tablet:flex-1">
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {categories.map(({ id, items }) => (
        <Tabs.Content key={id} value={id}>
          <Accordion.Root
            type="single"
            size="lg"
            isStretched
            collapsible
            value={openQuestionId}
            onValueChange={setOpenQuestionId}
          >
            {items.map((item) => (
              <Accordion.Item key={item.id} value={item.id}>
                <Accordion.Trigger>{item.title}</Accordion.Trigger>
                <Accordion.Content>{item.content}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
