import { useMediaQueryFlags } from "@jects/jds/hooks";
import { Dialog, VisuallyHidden } from "radix-ui";

import { useDialogOpenerFocus } from "@/hooks/useDialogOpenerFocus";
import { cn } from "@/utils/cn";

import { SidebarContent } from "./SidebarContent";

const PANEL_CLASS = "flex w-[220px] flex-col border-x border-stroke-subtle bg-surface-shallow";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isDesktop } = useMediaQueryFlags();
  const openerFocus = useDialogOpenerFocus();

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
          {...openerFocus}
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
