import { Dialog } from "@jects/jds";

import { useDialogStore } from "@/stores/dialogStore";

export function GlobalDialog() {
  const { open, pending, content, options, selectAction, dismiss } = useDialogStore();

  if (content === null) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && !pending && dismiss()}
      header={content.header}
      body={content.body}
      closeOnInteractOutside={pending ? false : options.closeOnInteractOutside}
      primaryAction={{
        children: content.primaryLabel,
        disabled: pending,
        onClick: () => void selectAction("primary"),
      }}
      secondaryAction={
        content.secondaryLabel
          ? {
              children: content.secondaryLabel,
              disabled: pending,
              onClick: () => void selectAction("secondary"),
            }
          : undefined
      }
    />
  );
}
