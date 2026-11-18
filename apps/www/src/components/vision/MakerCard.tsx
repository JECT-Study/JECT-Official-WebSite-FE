import Image from "next/image";

import { Icon, type IconName } from "@jects/jds";

import type { Maker, MakerRole } from "@/constants/members";

const ROLE_ICON: Record<MakerRole, IconName> = {
  프론트엔드: "position-fe",
  백엔드: "position-be",
  디자인: "position-pd",
  기획: "position-pm",
};

export function MakerCard({ maker }: { maker: Maker }) {
  return (
    <div className="flex items-start gap-20 rounded-4 border border-stroke-subtle bg-surface-shallow p-margin-sm">
      <Image
        src={maker.image}
        alt={`${maker.name} 프로필`}
        placeholder="blur"
        sizes="80px"
        className="size-80 shrink-0 rounded-4 border border-stroke-alpha-subtler object-cover"
      />
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex items-center gap-6">
          <Icon
            name={ROLE_ICON[maker.role]}
            size="xl"
            aria-label={maker.role}
            role="img"
            className="shrink-0"
          />
          <p className="font-title text-title-1 font-title-subtle text-object-bolder">
            {maker.name}
          </p>
        </div>
        <p className="font-body text-body-xs font-body-bold text-object-neutral">
          {maker.description}
        </p>
      </div>
    </div>
  );
}
