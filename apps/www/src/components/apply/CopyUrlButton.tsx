"use client";

import { IconButton, toastController, Tooltip } from "@jects/jds";

export function CopyUrlButton() {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toastController.basic("URL을 클립보드에 복사했습니다.");
    } catch {
      toastController.destructive("URL 복사에 실패했습니다.");
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
