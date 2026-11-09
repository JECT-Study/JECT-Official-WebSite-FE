"use client";

import { Icon, Tooltip } from "@jects/jds";

export function ExperiencePeriodTooltip() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          type="button"
          aria-label="직무 관련 경험 기간 안내"
          className="flex text-object-assistive"
        >
          <Icon name="info" size="2xs" />
        </Tooltip.Trigger>
        <Tooltip.Content>학습과 경력을 모두 포함한 기간</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
