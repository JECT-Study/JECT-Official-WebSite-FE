import Image from "next/image";
import Link from "next/link";

import { ContentBadge, EmptyState, LabelButton } from "@jects/jds";

import introImage from "@/assets/images/landing/intro-section.webp";
import { type Position, POSITIONS, PROGRAMS, STATS } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

import { SectionTitle } from "./SectionTitle";

const THEME_CLASS: Record<Position["theme"], string> = {
  green: "border-theme-green-alpha-subtler bg-theme-green-alpha-subtlest",
  sky: "border-theme-sky-alpha-subtler bg-theme-sky-alpha-subtlest",
  indigo: "border-theme-indigo-alpha-subtler bg-theme-indigo-alpha-subtlest",
  orange: "border-theme-orange-alpha-subtler bg-theme-orange-alpha-subtlest",
  purple: "border-theme-purple-alpha-subtler bg-theme-purple-alpha-subtlest",
};

function AboutBlock() {
  return (
    <div className="flex flex-col gap-48">
      <Image
        src={introImage}
        alt=""
        placeholder="blur"
        sizes="(min-width: 1200px) 922px, 100vw"
        className="aspect-21/9 w-full border border-stroke-alpha-subtler object-cover object-top"
      />
      <div className="flex flex-col items-start gap-40">
        <div className="flex flex-col gap-24">
          <SectionTitle as="h1" phrases={["IT", "동아리", "젝트"]} />
          <div className="flex flex-col gap-8 font-body text-body-lg font-body-bold text-object-normal">
            <p>
              젝트는 개발, 기획(매니지먼트), 디자인 관련 포지션의 팀원들이 한 팀이 되어 실제
              사용자에게 제공되는 디지털 서비스를 직접 만들고 운영하는 IT 동아리입니다.
            </p>
            <p>
              기획-개발-디자인의 협업 과정 전반을 경험하며, 사용자의 불편함을 해결하는 프로덕트
              개발·운영, 네트워킹을 통한 관계 구축을 핵심 가치로 삼고 있어요.
            </p>
          </div>
        </div>
        <ul
          role="list"
          className="grid w-full grid-cols-1 gap-16 tablet:grid-cols-2 desktop:grid-cols-3"
        >
          {STATS.map(({ value, label }, index) => (
            <li
              key={label}
              className={cn(
                "flex flex-col gap-16 rounded-6 border border-stroke-alpha-assistive bg-surface-deep px-20 py-16 text-object-bold",
                index === STATS.length - 1 && "tablet:col-span-2 desktop:col-span-1"
              )}
            >
              <p className="font-title text-title-2 font-title-subtle">{value}</p>
              <p className="font-body text-body-lg font-body-normal">{label}</p>
            </li>
          ))}
        </ul>
        <LabelButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
          <Link href={ROUTES.vision}>젝트의 비전과 스토리에 대해</Link>
        </LabelButton>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  const { title, icon: Icon, description, tags, theme } = position;

  return (
    <div className={cn("flex flex-col gap-16 rounded-6 border px-24 py-20", THEME_CLASS[theme])}>
      <div className="flex items-center gap-8">
        <Icon aria-hidden className="size-24 shrink-0" />
        <h3 className="font-title text-title-2 font-title-subtle text-object-boldest">{title}</h3>
      </div>
      <p className="font-body text-body-md font-body-normal text-object-bold">{description}</p>
      <ul role="list" className="flex flex-wrap gap-8">
        {tags.map((tag) => (
          <li key={tag}>
            <ContentBadge variant={theme} size="sm" badgeStyle="alpha">
              {tag}
            </ContentBadge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PositionsBlock() {
  return (
    <div className="flex flex-col gap-48">
      <SectionTitle phrases={["다양한", "포지션들이", "젝트와", "함께합니다"]} />
      <div className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
        {POSITIONS.map((position) => (
          <PositionCard key={position.title} position={position} />
        ))}
        <EmptyState
          variant="dashed"
          header="젝트만의 협업 문화"
          body={"기획부터 출시까지, 다양한 직군이 함께 협업하며\n하나의 서비스를 완성해요."}
          className="h-full w-full max-w-none [&_p]:whitespace-pre-line"
        />
      </div>
    </div>
  );
}

function ProgramsBlock() {
  return (
    <div className="flex flex-col gap-48">
      <SectionTitle phrases={["구성원들의", "성장을", "돕는", "프로그램들을", "운영합니다"]} />
      <ol role="list" className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
        {PROGRAMS.map(({ title, description }, index) => (
          <li
            key={title}
            className={cn(
              "flex flex-col gap-16 rounded-6 border px-20 py-16",
              index === 0
                ? "border-accent-alpha-subtle bg-accent-alpha-subtlest text-accent-normal"
                : "border-stroke-alpha-subtler bg-surface-deep text-object-normal"
            )}
          >
            <h3 className="font-title text-title-1 font-title-subtle">
              {index + 1}. {title}
            </h3>
            <p className="font-body text-body-md font-body-normal">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function IntroSection() {
  return (
    <section className="flex justify-center bg-surface-standard px-margin-lg py-margin-5xl">
      <div className="flex w-full max-w-content flex-col gap-128 pt-margin-xl pb-80">
        <AboutBlock />
        <PositionsBlock />
        <ProgramsBlock />
      </div>
    </section>
  );
}
