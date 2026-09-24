import type { RefObject } from "react";

import { IconButton } from "@jects/jds";
import { useLocation } from "react-router-dom";

import { findActiveLink } from "@/constants/navigation";

interface HeaderProps {
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpenSidebar: () => void;
  onActionSlotChange: (element: HTMLDivElement | null) => void;
}

export function Header({ triggerRef, onOpenSidebar, onActionSlotChange }: HeaderProps) {
  const { pathname } = useLocation();
  const activeLink = findActiveLink(pathname);

  return (
    <header className="flex items-center gap-24 px-margin-lg pt-20 pb-12 desktop:gap-28 desktop:px-margin-xl desktop:pt-28 desktop:pb-20">
      <IconButton
        ref={triggerRef}
        hierarchy="primary"
        icon="panel-left"
        size="lg"
        condensed={false}
        aria-label="메뉴 열기"
        onClick={onOpenSidebar}
        className="desktop:hidden"
      />
      <h1 className="min-w-0 flex-1 truncate text-title-2 font-title-bold text-object-boldest desktop:text-title-3">
        {activeLink?.label}
      </h1>
      <div ref={onActionSlotChange} className="flex shrink-0 items-center" />
    </header>
  );
}
