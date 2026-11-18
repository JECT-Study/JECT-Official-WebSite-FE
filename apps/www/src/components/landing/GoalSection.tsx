import Image from "next/image";

import goalImage from "@/assets/images/landing/goal-section.webp";

export function GoalSection() {
  return (
    <section className="relative flex aspect-2/1 items-end justify-center bg-surface-static-inverse-standard px-margin-lg py-margin-xl">
      <Image
        src={goalImage}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-surface-static-inverse-standard" />
      <div className="relative flex w-full max-w-content flex-col gap-8 tablet:gap-16 tablet:py-8 desktop:py-24">
        <h2 className="font-title text-title-1 font-title-subtle text-object-static-inverse-boldest tablet:text-title-5 desktop:text-title-6">
          IT 생태계의
          <br />
          선순환을 목표로 하는 젝트
        </h2>
        <p className="font-label text-label-lg font-label-bold text-object-static-inverse-normal tablet:font-title tablet:text-title-1 tablet:font-title-subtle desktop:text-title-2">
          사적인 이윤을 추구하지 않고, <br className="max-tablet:hidden" />
          발생한 수익은 운영과 구성원을 위한 인프라에 재투자합니다.
        </p>
      </div>
    </section>
  );
}
