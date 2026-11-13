import Image from "next/image";
import Link from "next/link";

import { BlockButton } from "@jects/jds";

import joinImage from "@/assets/images/landing/join-section.webp";
import { Phrases } from "@/components/common/phrases";
import { SPONSORS } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";

import { SectionTitle } from "./SectionTitle";

function SponsorList() {
  return (
    <ul role="list" className="grid grid-cols-1 gap-16 tablet:grid-cols-2 desktop:grid-cols-3">
      {SPONSORS.map(({ name, logo, href }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="@container flex aspect-12/5 items-center justify-center rounded-6 border border-stroke-alpha-assistive bg-surface-deep"
          >
            <Image
              src={logo}
              alt={`${name} 웹사이트 (새 창 열림)`}
              sizes="160px"
              className="max-h-[calc(100cqw/4.8)] w-1/2 max-w-[160px] object-contain"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function JoinSection() {
  return (
    <section
      data-theme="dark"
      className="flex justify-center bg-surface-standard px-margin-lg py-margin-5xl"
    >
      <div className="flex w-full max-w-content flex-col pb-80">
        <div className="flex flex-col gap-48 pt-margin-xl pb-margin-3xl tablet:flex-row">
          <div className="flex shrink-0 flex-col items-start gap-48 tablet:w-[280px]">
            <div className="flex flex-col gap-16">
              <SectionTitle phrases={["젝트의", "구성원으로", "함께해주세요"]} />
              <p className="font-label text-label-lg font-label-bold text-object-bold">
                모든 구성원들의 몰입과 성장을 위해.
              </p>
            </div>
            <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
              <Link href={ROUTES.applyList}>지원하러 가기</Link>
            </BlockButton>
          </div>
          <Image
            src={joinImage}
            alt=""
            placeholder="blur"
            sizes="(min-width: 1200px) 594px, (min-width: 768px) 50vw, 100vw"
            className="aspect-4/3 min-w-0 flex-1 border border-stroke-alpha-subtler object-cover"
          />
        </div>
        <div className="flex flex-col gap-32 pt-32 pb-12">
          <div className="flex flex-col gap-16">
            <h2 className="font-title text-title-3 font-title-normal text-object-boldest">
              <Phrases phrases={["젝트와", "함께하는", "파트너"]} />
            </h2>
            <p className="font-body text-body-lg font-body-normal text-object-normal">
              구성원들의 몰입과 성장을 지원하고 있어요.
            </p>
          </div>
          <SponsorList />
        </div>
      </div>
    </section>
  );
}
