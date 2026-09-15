import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/cn";

// Figma의 셀 사이 간격 16을 셀 좌우 여백 8로 나눠 적용하고, 양 끝 셀만 16을 준다.
const CELL = "px-8 first:pl-16 last:pr-16 py-12 text-left font-label";
const BODY_CELL = "border-b border-stroke-alpha-subtle align-top group-last:border-b-0";

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
        "border-b border-stroke-subtle align-middle text-label-sm font-label-normal text-object-alternative",
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

export function DataTableBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function DataTableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr className={cn("group hover:bg-fill-bold/5 active:bg-fill-bold/8", className)} {...props} />
  );
}

export function DataTableCell({ className, children, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        CELL,
        BODY_CELL,
        "text-label-md font-label-normal text-object-normal",
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
      <span className="block truncate text-label-lg font-label-normal text-object-bolder">
        {children}
      </span>
      <span className="mt-2 block truncate text-label-md font-label-subtle text-object-alternative">
        {description}
      </span>
    </th>
  );
}
