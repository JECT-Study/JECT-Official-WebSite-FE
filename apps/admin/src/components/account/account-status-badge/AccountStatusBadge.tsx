import { ContentBadge } from "@jects/jds";

import { ACCOUNT_STATUS_LABELS, type AccountStatus } from "@/constants/account";

interface AccountStatusBadgeProps {
  status: AccountStatus;
}

export function AccountStatusBadge({ status }: AccountStatusBadgeProps) {
  return (
    <ContentBadge hierarchy={status === "ACTIVE" ? "primary" : "tertiary"} badgeStyle="solid">
      {ACCOUNT_STATUS_LABELS[status]}
    </ContentBadge>
  );
}
