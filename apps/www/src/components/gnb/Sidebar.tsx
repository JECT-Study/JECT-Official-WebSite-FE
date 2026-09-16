"use client";

import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";

import { Divider, IconButton, Menu } from "@jects/jds";

import { NAVIGATION_SECTIONS } from "@/constants/navigation";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { cn } from "@/utils/cn";

import { SidebarLinkItem } from "./SidebarLinkItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isHydrated = useIsHydrated();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isHydrated) return null;

  const easeClass = isOpen ? "ease-entrance" : "ease-leave";

  return createPortal(
    <div className="tablet:hidden">
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-overlay h-dvh w-dvw bg-curtain-static-dim transition-opacity duration-300",
          easeClass
        )}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
      />
      <div
        className={cn(
          "fixed top-0 right-0 z-overlay h-dvh w-[240px] bg-surface-standard shadow-overlay transition-transform duration-300",
          easeClass
        )}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-end border-b border-stroke-subtle px-margin-lg py-10">
          <IconButton
            hierarchy="primary"
            icon="x"
            size="md"
            condensed={false}
            aria-label="메뉴 닫기"
            onClick={onClose}
            className="text-object-boldest"
          />
        </div>
        <Menu.Root size="lg">
          <div className="flex flex-col gap-24 px-margin-lg py-margin-xl">
            {NAVIGATION_SECTIONS.map((section, index) => (
              <Fragment key={section.name}>
                {index > 0 && <Divider className="-mt-6" />}
                <Menu.Content className="p-0 [&>:first-child]:mx-0 [&>:first-child]:mb-6">
                  <Menu.Category as="span">{section.name}</Menu.Category>
                  <Menu.Group className="max-w-[120px]">
                    {section.links.map((link) => (
                      <SidebarLinkItem key={link.href} link={link} onNavigate={onClose} />
                    ))}
                  </Menu.Group>
                </Menu.Content>
              </Fragment>
            ))}
          </div>
        </Menu.Root>
      </div>
    </div>,
    document.body
  );
}
