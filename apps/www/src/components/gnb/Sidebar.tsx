"use client";

import { Fragment, useState } from "react";

import { Divider, IconButton, Menu } from "@jects/jds";
import { Dialog, VisuallyHidden } from "radix-ui";

import { NAVIGATION_SECTIONS } from "@/constants/navigation";
import { cn } from "@/utils/cn";

import { SidebarLinkItem } from "./SidebarLinkItem";

interface SidebarProps {
  triggerClassName?: string;
}

export function Sidebar({ triggerClassName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <IconButton
          hierarchy="primary"
          icon="menu"
          size="lg"
          aria-label="메뉴 열기"
          className={cn("tablet:hidden", triggerClassName)}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-curtain fixed inset-0 z-overlay bg-curtain-static-dim tablet:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="sheet-panel fixed inset-y-0 right-0 z-overlay w-[240px] bg-surface-standard shadow-overlay [--sheet-offset:100%] tablet:hidden"
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
            <div className="flex flex-col gap-24 px-margin-lg py-margin-xl">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
