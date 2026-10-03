import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/cn";

// Figma의 셀 사이 간격 16을 셀 좌우 여백 8로 나눠 적용하고, 양 끝 셀만 16을 준다.
const CELL = "px-8 first:pl-16 last:pr-16 py-12 text-left font-label";
const HEADER_CELL = "border-b border-stroke-subtle align-middle";
const BODY_CELL =
  "border-b border-stroke-alpha-subtle align-top group-last:border-b-0 group-data-[selection-disabled=false]:group-hover:bg-fill-bold/5 group-data-[selection-disabled=false]:group-active:bg-fill-bold/8";
// 드래그 중인 행의 위아래 선은 바깥 그림자로 그려 표 끝에 닿으면 표 테두리와 겹치게 한다.
// 행 높이가 바뀌지 않도록 원래 아래 테두리는 두께를 유지한 채 투명하게만 만든다.
const DRAGGING_CELL =
  "group-data-[dragging=true]:border-b-transparent group-data-[dragging=true]:bg-fill-bold/8 group-data-[dragging=true]:shadow-[0_-1px_0_var(--color-stroke-subtle),0_1px_0_var(--color-stroke-subtle)]";
const SELECTION_DISABLED_TEXT = "group-data-[selection-disabled=true]:text-object-subtle";
// 컨트롤 20px에 왼쪽 여백 16, 오른쪽 여백 8을 더해 다음 칸까지 간격 16을 맞춘다.
const CONTROL_CELL = "w-[44px]";

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

export function DataTableControlHeaderItem({
  className,
  children,
  ...props
}: ComponentProps<"th">) {
  return (
    <th scope="col" className={cn(CELL, HEADER_CELL, CONTROL_CELL, className)} {...props}>
      <div className="flex h-20 items-center">{children}</div>
    </th>
  );
}

export function DataTableBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export interface DataTableRowProps extends ComponentProps<"tr"> {
  selected?: boolean;
  selectionDisabled?: boolean;
  dragging?: boolean;
}

export function DataTableRow({
  selected = false,
  selectionDisabled = false,
  dragging = false,
  className,
  ...props
}: DataTableRowProps) {
  return (
    <tr
      data-selected={selected}
      data-selection-disabled={selectionDisabled}
      data-dragging={dragging}
      className={cn(
        "group data-[selected=true]:bg-accent-alpha-subtlest data-[selection-disabled=true]:bg-fill-subtlest/54 data-[selected=true]:data-[selection-disabled=true]:bg-accent-alpha-subtlest/54",
        // 드래그 중인 행이 다른 행과 겹쳐도 비치지 않도록 불투명 배경을 우선하고, 선택 배경은 그 위에 이미지로 겹친다.
        "data-[dragging=true]:bg-surface-standard! data-[dragging=true]:data-[selected=true]:bg-[linear-gradient(var(--color-accent-alpha-subtlest)_0_0)]",
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
        DRAGGING_CELL,
        "text-label-md font-label-normal text-object-normal",
        SELECTION_DISABLED_TEXT,
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
    <th scope="row" className={cn(CELL, BODY_CELL, DRAGGING_CELL, className)} {...props}>
      <span
        className={cn(
          "block truncate text-label-lg font-label-normal text-object-bolder",
          SELECTION_DISABLED_TEXT
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "mt-2 block truncate text-label-md font-label-subtle text-object-alternative",
          SELECTION_DISABLED_TEXT
        )}
      >
        {description}
      </span>
    </th>
  );
}

export function DataTableControlCell({ className, children, ...props }: ComponentProps<"td">) {
  return (
    <td className={cn(CELL, BODY_CELL, DRAGGING_CELL, CONTROL_CELL, className)} {...props}>
      <div className="flex h-[22px] items-center">{children}</div>
    </td>
  );
}
