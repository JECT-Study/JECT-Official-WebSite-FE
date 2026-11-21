import { toastController } from "@jects/jds";

import type { ToastContent } from "@/constants/toast";

export function showToast({ variant, title, description }: ToastContent) {
  toastController[variant](title, { description });
}
