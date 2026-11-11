import { BlockButton, MultiSelect } from "@jects/jds";
// JDS에 Popover가 추가되면 그쪽으로 교체한다.
import { Popover } from "radix-ui";

import type { JobFamily } from "@/apis/recruit/schemas";
import { JOB_FAMILY_BADGES } from "@/constants/jobFamily";

interface JobFamilyFilterButtonProps {
  jobFamilies: readonly JobFamily[];
  width: string;
  value: JobFamily[];
  onChange: (value: JobFamily[]) => void;
}

export default function JobFamilyFilterButton({
  jobFamilies,
  width,
  value,
  onChange,
}: JobFamilyFilterButtonProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <BlockButton hierarchy="secondary" size="xs" variant="hollow" prefixIcon="plus">
          필터 추가
        </BlockButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={4} className="z-floated">
          <MultiSelect
            width={width}
            maxHeight="var(--radix-popover-content-available-height)"
            variant="control"
            options={jobFamilies.map((jobFamily) => ({
              value: jobFamily,
              label: JOB_FAMILY_BADGES[jobFamily]?.label ?? jobFamily,
            }))}
            value={value}
            onChange={(selected) =>
              onChange(jobFamilies.filter((jobFamily) => selected.includes(jobFamily)))
            }
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
