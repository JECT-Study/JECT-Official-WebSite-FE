import type { DialogProps } from "@jects/jds";

export interface DialogContent extends Pick<DialogProps, "header" | "body"> {
  primaryLabel: string;
  secondaryLabel?: string;
}
