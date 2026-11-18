import Image from "next/image";

import { Icon } from "@jects/jds";

import heroImage from "@/assets/images/landing/hero-section.png";

import { RotatingPositions } from "./RotatingPositions";

export function HeroSection() {
  return (
    <section className="relative flex h-dvh items-center justify-center overflow-hidden bg-surface-static-inverse-standard px-margin-lg">
      <Image
        src={heroImage}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="object-cover opacity-76"
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#191b2450] to-transparent to-20%" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-50% to-surface-static-inverse-standard" />

      <div
        aria-hidden
        className="relative bg-[radial-gradient(33.77%_43.9%_at_50%_50%,#191b2480_0%,#191b2400_100%)] text-center font-title text-title-5 font-title-subtle text-object-static-inverse-boldest"
      >
        <span className="block">젝트에서</span>
        <span className="block">
          <RotatingPositions />
        </span>
        <span className="block">경험해보세요.</span>
      </div>

      <div className="absolute bottom-24 flex flex-col items-center gap-8 text-object-static-inverse-boldest">
        <span className="font-label text-label-md font-label-bold">아래로 스크롤해주세요</span>
        <Icon name="chevron-down" size="xs" aria-hidden />
      </div>
    </section>
  );
}
