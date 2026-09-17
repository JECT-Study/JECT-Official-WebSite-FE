import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/cn";

// Figma의 셀 사이 간격 16을 셀 좌우 여백 8로 나눠 적용하고, 양 끝 셀만 16을 준다.
const CELL = "px-8 first:pl-16 last:pr-16 py-12 text-left font-label";
const HEADER_CELL = "border-b border-stroke-subtle align-middle";
const BODY_CELL =
  "border-b border-stroke-alpha-subtle align-top group-last:border-b-0 group-data-[disabled=false]:group-hover:bg-fill-bold/5 group-data-[disabled=false]:group-active:bg-fill-bold/8";
const DISABLED_TEXT = "group-data-[disabled=true]:text-object-subtle";
// 체크박스 20px에 왼쪽 여백 16, 오른쪽 여백 8을 더해 다음 칸까지 간격 16을 맞춘다.
const CHECKBOX_CELL = "w-[44px]";

export function DataTableRoot({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn(
        "w-full table-fixed border-separate border-spacing-0 overflow-clip rounded-10 border border-stroke-subtle bg-surface-standard",
        className
      )}
      {...props}
    />
  );
}

export function DataTableHeader({ className, children, ...props }: ComponentProps<"thead">) {
  return (
    <thead className={cn("bg-surface-deeper", className)} {...props}>
      <tr>{children}</tr>
    </thead>
  );
}

export function DataTableHeaderItem({ className, children, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        CELL,
        HEADER_CELL,
        "text-label-sm font-label-normal text-object-alternative",
        className
      )}
      {...props}
    >
      <div className="flex h-20 items-center">
        <div className="min-w-0 flex-1 truncate">{children}</div>
      </div>
    </th>
  );
}

export function DataTableCheckboxHeaderItem({
  className,
  children,
  ...props
}: ComponentProps<"th">) {
  return (
    <th scope="col" className={cn(CELL, HEADER_CELL, CHECKBOX_CELL, className)} {...props}>
      <div className="flex h-20 items-center">{children}</div>
    </th>
  );
}

export function DataTableBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

interface DataTableRowProps extends ComponentProps<"tr"> {
  selected?: boolean;
  disabled?: boolean;
}

export function DataTableRow({
  selected = false,
  disabled = false,
  className,
  ...props
}: DataTableRowProps) {
  return (
    <tr
      data-selected={selected}
      data-disabled={disabled}
      className={cn(
        "group data-[disabled=true]:bg-fill-subtlest/54 data-[selected=true]:bg-accent-alpha-subtlest data-[selected=true]:data-[disabled=true]:bg-accent-alpha-subtlest/54",
        className
      )}
      {...props}
    />
  );
}

export function DataTableCell({ className, children, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        CELL,
        BODY_CELL,
        "text-label-md font-label-normal text-object-normal",
        DISABLED_TEXT,
        className
      )}
      {...props}
    >
      <div className="flex h-[22px] items-center">
        <div className="min-w-0 flex-1 truncate">{children}</div>
      </div>
    </td>
  );
}

interface DataTableTitleCellProps extends ComponentProps<"th"> {
  description: ReactNode;
}

export function DataTableTitleCell({
  description,
  className,
  children,
  ...props
}: DataTableTitleCellProps) {
  return (
    <th scope="row" className={cn(CELL, BODY_CELL, className)} {...props}>
      <span
        className={cn(
          "block truncate text-label-lg font-label-normal text-object-bolder",
          DISABLED_TEXT
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "mt-2 block truncate text-label-md font-label-subtle text-object-alternative",
          DISABLED_TEXT
        )}
      >
        {description}
      </span>
    </th>
  );
}

export function DataTableCheckboxCell({ className, children, ...props }: ComponentProps<"td">) {
  return (
    <td className={cn(CELL, BODY_CELL, CHECKBOX_CELL, className)} {...props}>
      <div className="flex h-[22px] items-center">{children}</div>
    </td>
  );
}
