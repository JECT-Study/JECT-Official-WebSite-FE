import type { RefObject } from "react";

import { useMediaQueryFlags } from "@jects/jds/hooks";
import { Dialog, VisuallyHidden } from "radix-ui";

import { cn } from "@/utils/cn";

import { SidebarContent } from "./SidebarContent";

const PANEL_CLASS = "flex w-[220px] flex-col border-x border-stroke-subtle bg-surface-shallow";

interface SidebarProps {
  isOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export function Sidebar({ isOpen, triggerRef, onClose }: SidebarProps) {
  const { isDesktop } = useMediaQueryFlags();

  if (isDesktop) {
    return (
      <aside data-theme="dark" className={cn(PANEL_CLASS, "sticky top-0 h-dvh")}>
        <SidebarContent />
      </aside>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-curtain fixed inset-0 z-raised bg-curtain-static-dim" />
        <Dialog.Content
          data-theme="dark"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
          className={cn(
            PANEL_CLASS,
            "sheet-panel fixed inset-y-0 left-0 z-raised [--sheet-offset:-100%]"
          )}
        >
          <Dialog.Title asChild>
            <VisuallyHidden.Root>주요 메뉴</VisuallyHidden.Root>
          </Dialog.Title>
          <SidebarContent />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
