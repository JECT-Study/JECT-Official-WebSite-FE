"use client";

import { Dialog } from "@jects/jds";

import { useDialogStore } from "@/stores/dialogStore";

export function GlobalDialog() {
  const { open, options, selectAction, dismiss } = useDialogStore();

  if (options === null) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && dismiss()}
      header={options.header}
      body={options.body}
      primaryAction={{ children: options.primaryLabel, onClick: () => selectAction("primary") }}
      secondaryAction={
        options.secondaryLabel
          ? { children: options.secondaryLabel, onClick: () => selectAction("secondary") }
          : undefined
      }
    />
  );
}
