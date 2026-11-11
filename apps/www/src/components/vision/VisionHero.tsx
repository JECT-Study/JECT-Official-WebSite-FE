import Image from "next/image";

import visionBannerImage from "@/assets/images/vision-banner.png";
import { Phrases } from "@/components/common/phrases";

export function VisionHero() {
  return (
    <header className="flex flex-col gap-24 pt-margin-xl pb-margin-3xl">
      <p className="font-title text-title-1 font-title-subtle text-object-neutral">
        IT 생태계의 선순환을 목표로 활동하는
      </p>
      <h1 className="font-title text-title-5 font-title-subtle text-object-boldest">
        <Phrases
          phrases={[
            "대한민국의",
            "IT 동아리",
            <span key="ject" className="text-accent-normal">
              젝트
            </span>,
          ]}
        />
      </h1>
      <Image
        src={visionBannerImage}
        alt="JECT IT 동아리 젝트 배너"
        placeholder="blur"
        preload
        sizes="(min-width: 1200px) 922px, 100vw"
        className="aspect-21/9 w-full border border-stroke-alpha-subtler object-cover"
      />
    </header>
  );
}
