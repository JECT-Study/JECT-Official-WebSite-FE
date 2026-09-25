import type { ReactNode } from "react";

import { LocalNavigation } from "@jects/jds";
import { Dialog } from "radix-ui";

import { useDialogOpenerFocus } from "@/hooks/useDialogOpenerFocus";

interface DrawerProps {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Drawer({ open, title, onOpenChange, children }: DrawerProps) {
  const openerFocus = useDialogOpenerFocus();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-curtain fixed inset-0 z-raised bg-curtain-static-dim" />
        <Dialog.Content
          aria-label={title}
          onInteractOutside={(event) => event.preventDefault()}
          {...openerFocus}
          className="sheet-panel fixed inset-y-0 right-0 z-raised flex w-full max-w-[700px] flex-col bg-surface-standard [--sheet-offset:100%]"
        >
          <div className="border-b border-b-stroke-alpha-subtler px-margin-lg pt-24 pb-8">
            <LocalNavigation
              nested
              stretched
              title={title}
              titleAs="h2"
              onBackClick={() => onOpenChange(false)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
