import type { FC, SVGProps } from "react";
import Image from "next/image";

import PositionBe from "@/assets/svg/position-be.svg";
import PositionFe from "@/assets/svg/position-fe.svg";
import PositionPd from "@/assets/svg/position-pd.svg";
import PositionPm from "@/assets/svg/position-pm.svg";
import type { Maker, MakerRole } from "@/constants/members";

const ROLE_ICON: Record<MakerRole, FC<SVGProps<SVGSVGElement>>> = {
  프론트엔드: PositionFe,
  백엔드: PositionBe,
  디자인: PositionPd,
  기획: PositionPm,
};

export function MakerCard({ maker }: { maker: Maker }) {
  const RoleIcon = ROLE_ICON[maker.role];

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
          <RoleIcon aria-label={maker.role} role="img" className="shrink-0" />
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
