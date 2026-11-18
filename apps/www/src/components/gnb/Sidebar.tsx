"use client";

import { Fragment, useState } from "react";

import { Divider, IconButton, Menu } from "@jects/jds";
import { Dialog, VisuallyHidden } from "radix-ui";

import { NAVIGATION_SECTIONS } from "@/constants/navigation";
import { useTheme } from "@/hooks/useTheme";

import { SidebarLinkItem } from "./SidebarLinkItem";

interface SidebarProps {
  triggerColor?: string;
}

export function Sidebar({ triggerColor }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const close = () => setIsOpen(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <IconButton
          {...(triggerColor
            ? { hierarchy: "accent", accentColor: { normal: triggerColor } }
            : { hierarchy: "primary" })}
          icon="menu"
          size="lg"
          aria-label="메뉴 열기"
          className="tablet:hidden"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-curtain fixed inset-0 z-overlay bg-curtain-static-dim tablet:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="sheet-panel fixed inset-y-0 right-0 z-overlay flex w-[240px] flex-col bg-surface-standard shadow-overlay [--sheet-offset:100%] tablet:hidden"
        >
          <Dialog.Title asChild>
            <VisuallyHidden.Root>전체 메뉴</VisuallyHidden.Root>
          </Dialog.Title>
          <div className="flex items-center justify-end border-b border-stroke-subtle px-margin-lg py-10">
            <Dialog.Close asChild>
              <IconButton
                hierarchy="primary"
                icon="x"
                size="md"
                condensed={false}
                aria-label="메뉴 닫기"
                className="text-object-boldest"
              />
            </Dialog.Close>
          </div>
          <Menu.Root size="lg">
            <div className="flex flex-1 flex-col gap-24 overflow-y-auto px-margin-lg py-margin-xl">
              {NAVIGATION_SECTIONS.map((section, index) => (
                <Fragment key={section.name}>
                  {index > 0 && <Divider className="-mt-6" />}
                  <Menu.Content className="p-0 [&>:first-child]:mx-0 [&>:first-child]:mb-6">
                    <Menu.Category as="span">{section.name}</Menu.Category>
                    <Menu.Group className="max-w-[120px]">
                      {section.links.map((link) => (
                        <SidebarLinkItem key={link.href} link={link} onNavigate={close} />
                      ))}
                    </Menu.Group>
                  </Menu.Content>
                </Fragment>
              ))}
            </div>
          </Menu.Root>
          <div className="flex justify-end border-t border-stroke-subtle bg-surface-deep px-16 pt-12 pb-16">
            <IconButton
              hierarchy="primary"
              icon={theme === "dark" ? "moon" : "sun"}
              size="lg"
              condensed={false}
              aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
