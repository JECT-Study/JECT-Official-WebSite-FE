import Image from "next/image";

import { ContentBadge, type ThemeVariant } from "@jects/jds";

import type { Supporter, SupporterRole } from "@/constants/members";

const ROLE_BADGE_VARIANT: Record<Exclude<SupporterRole, "대표">, ThemeVariant> = {
  운영: "lime",
  인프라: "sky",
  대외협력: "orange",
  BX: "purple",
};

function RoleBadge({ role }: { role: SupporterRole }) {
  if (role === "대표") {
    return (
      <ContentBadge hierarchy="accent" size="sm" badgeStyle="solid">
        {role}
      </ContentBadge>
    );
  }

  return (
    <ContentBadge variant={ROLE_BADGE_VARIANT[role]} size="sm" badgeStyle="alpha">
      {role}
    </ContentBadge>
  );
}

export function SupporterCard({ supporter }: { supporter: Supporter }) {
  return (
    <div className="flex flex-col gap-20 overflow-hidden rounded-4 border border-stroke-subtle bg-surface-shallow p-margin-sm">
      <Image
        src={supporter.image}
        alt={`${supporter.name} 프로필`}
        placeholder="blur"
        sizes="(min-width: 1200px) 180px, (min-width: 768px) 25vw, 50vw"
        className="aspect-square w-full rounded-4 border border-stroke-alpha-subtler object-cover"
      />
      <div className="flex items-center gap-8">
        <RoleBadge role={supporter.role} />
        <p className="font-title text-title-1 font-title-subtle text-object-bolder">
          {supporter.name}
        </p>
      </div>
    </div>
  );
}
