import { ContentBadge, type ThemeVariant } from "@jects/jds";

import { ACCOUNT_ROLE_LABELS, type AccountRole } from "@/constants/account";

// Figma의 cyan, fuchsia가 JDS 0.8.0에 없어 가장 가까운 teal, pink를 쓴다. JDS에 추가되면 교체한다.
const ROLE_VARIANTS: Record<AccountRole, ThemeVariant> = {
  ADMIN: "teal",
  OPERATIONS: "lime",
  SUPPORTER: "pink",
};

interface AccountRoleBadgeProps {
  role: AccountRole;
}

export function AccountRoleBadge({ role }: AccountRoleBadgeProps) {
  return (
    <ContentBadge variant={ROLE_VARIANTS[role]} badgeStyle="alpha">
      {ACCOUNT_ROLE_LABELS[role]}
    </ContentBadge>
  );
}
