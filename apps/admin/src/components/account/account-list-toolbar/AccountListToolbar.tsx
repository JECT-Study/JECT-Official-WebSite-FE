import type { ReactNode } from "react";

import { BlockButton, NumericBadge } from "@jects/jds";

interface AccountListToolbarProps {
  totalCount: number | undefined;
  canAddAccount: boolean;
  onAddAccount: () => void;
  children?: ReactNode;
}

export function AccountListToolbar({
  totalCount,
  canAddAccount,
  onAddAccount,
  children,
}: AccountListToolbarProps) {
  return (
    <div className="rounded-10 border border-stroke-subtle bg-surface-standard">
      <div className="flex items-center gap-12 px-16 py-12">
        <div className="flex items-center gap-6 text-label-md text-object-neutral">
          <span>전체</span>
          {totalCount !== undefined && (
            <NumericBadge hierarchy="tertiary" badgeStyle="hollow" size="md">
              {totalCount}
            </NumericBadge>
          )}
        </div>
        {canAddAccount && (
          <BlockButton
            hierarchy="primary"
            variant="solid"
            size="xs"
            prefixIcon="plus"
            onClick={onAddAccount}
          >
            계정 추가
          </BlockButton>
        )}
      </div>
      {children && <div className="border-t border-stroke-subtle px-16 py-12">{children}</div>}
    </div>
  );
}
