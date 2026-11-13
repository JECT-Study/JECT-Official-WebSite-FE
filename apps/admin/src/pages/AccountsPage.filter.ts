import type { AccountListParams } from "@/apis/account/query";
import type {
  FilterField,
  FilterOptionValue,
  FilterValues,
} from "@/components/common/filter/Filter.types";
import {
  ACCOUNT_ROLE_LABELS,
  ACCOUNT_ROLES,
  ACCOUNT_STATUS_LABELS,
  ACCOUNT_STATUSES,
} from "@/constants/account";

export const ACCOUNT_FILTER_FIELDS: FilterField[] = [
  {
    id: "role",
    label: "계정 유형",
    options: ACCOUNT_ROLES.map((role) => ({ value: role, label: ACCOUNT_ROLE_LABELS[role] })),
  },
  {
    id: "status",
    label: "상태",
    options: ACCOUNT_STATUSES.map((status) => ({
      value: status,
      label: ACCOUNT_STATUS_LABELS[status],
    })),
  },
];

function pickAllowed<T extends string>(allowed: readonly T[], selected: FilterOptionValue[] = []) {
  return allowed.filter((value) => selected.includes(value));
}

export function toAccountListFilter(
  values: FilterValues
): Pick<AccountListParams, "roles" | "statuses"> {
  return {
    roles: pickAllowed(ACCOUNT_ROLES, values.role),
    statuses: pickAllowed(ACCOUNT_STATUSES, values.status),
  };
}
