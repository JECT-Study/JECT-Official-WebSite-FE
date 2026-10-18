"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  BlockButton,
  IconButton,
  LocalNavigation,
  Tabs,
  toastController,
  Tooltip,
} from "@jects/jds";

import type { Recruit } from "@/apis/recruit/schemas";
import { ROUTES, routeTo } from "@/constants/routes";
import { formatDate } from "@/utils/formatDate";

import { getRecruitTitle } from "./format";

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

interface RecruitFaq {
  title: string;
  content: ReactNode;
}

interface RecruitGuideProps {
  recruit: Recruit;
  isClosed: boolean;
  information: ReactNode;
  notice: ReactNode;
  faqs: RecruitFaq[];
}

export function RecruitGuide({ recruit, isClosed, information, notice, faqs }: RecruitGuideProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = parseTabParam(searchParams.get("tab"));
  const openFaq = searchParams.get("faq") ?? "";

  const title = getRecruitTitle(recruit);
  const lastSpaceIndex = title.lastIndexOf(" ");

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

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toastController.basic("URL을 클립보드에 복사했습니다.");
  };

  return (
    <>
      <LocalNavigation
        title="지원 안내"
        nested
        onBackClick={() => router.push(ROUTES.applyList)}
        stretched
      />

      <section className="flex flex-col gap-32 pt-margin-xl pb-margin-3xl">
        <div className="flex flex-col gap-16">
          <h1 className="font-title text-title-5 font-title-bold break-keep text-object-boldest">
            {title.slice(0, lastSpaceIndex + 1)}
            {/* URL 복사 버튼만 다음 줄로 넘어가지 않도록 마지막 단어와 묶는다. */}
            <span className="inline-flex items-center gap-8 whitespace-nowrap">
              {title.slice(lastSpaceIndex + 1)}
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <IconButton
                      icon="link"
                      size="2xl"
                      hierarchy="tertiary"
                      condensed
                      aria-label="URL 복사"
                      onClick={handleCopyUrl}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content>URL 복사</Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            </span>
          </h1>
          <p className="font-label text-label-lg font-label-bold text-object-neutral">
            <span className="whitespace-nowrap">{formatDate(recruit.startDate)}</span> -{" "}
            <span className="whitespace-nowrap">{formatDate(recruit.endDate)}</span>
          </p>
        </div>

        <div className="flex gap-12">
          {isClosed ? (
            <BlockButton hierarchy="accent" size="lg" className="flex-1" disabled>
              모집이 마감되었습니다
            </BlockButton>
          ) : (
            <>
              <BlockButton asChild variant="outlined" hierarchy="secondary" size="lg">
                <Link href={routeTo.applyContinue(recruit.recruitId)}>이어서 작성하기</Link>
              </BlockButton>
              <BlockButton
                asChild
                hierarchy="accent"
                size="lg"
                suffixIcon="arrow-right"
                className="flex-1"
              >
                <Link href={routeTo.applyFunnel(recruit.recruitId)}>지원서 작성하기</Link>
              </BlockButton>
            </>
          )}
        </div>
      </section>

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
    </>
  );
}
