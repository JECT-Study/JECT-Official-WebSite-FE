"use client";

import { Dialog } from "@jects/jds";

import { useDialogStore } from "@/stores/dialogStore";

export function GlobalDialog() {
  const { open, content, selectAction, dismiss } = useDialogStore();

  if (content === null) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && dismiss()}
      header={content.header}
      body={content.body}
      primaryAction={{ children: content.primaryLabel, onClick: () => selectAction("primary") }}
      secondaryAction={
        content.secondaryLabel
          ? { children: content.secondaryLabel, onClick: () => selectAction("secondary") }
          : undefined
      }
    />
  );
}
