"use client";

import { IconButton, Tooltip } from "@jects/jds";

import { TOAST_CONTENT } from "@/constants/toast";
import { showToast } from "@/utils/showToast";

export function CopyUrlButton() {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(TOAST_CONTENT.urlCopied);
    } catch {
      showToast(TOAST_CONTENT.copyUrlFailed);
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            icon="link"
            size="2xl"
            hierarchy="tertiary"
            condensed
            aria-label="URL 복사"
            onClick={handleCopyUrl}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>URL 복사</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
