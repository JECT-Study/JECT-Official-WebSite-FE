import { Chip, MultiSelect } from "@jects/jds";
// JDS에 Popover가 추가되면 그쪽으로 교체한다.
import { Popover } from "radix-ui";

import type { FilterField, FilterOptionValue } from "./Filter.types";

interface FilterChipProps {
  field: FilterField;
  selected: FilterOptionValue[];
  onChange: (values: FilterOptionValue[]) => void;
  onRemove: () => void;
}

export default function FilterChip({ field, selected, onChange, onRemove }: FilterChipProps) {
  // JDS Select는 값을 문자열로만 다뤄서 숫자 값은 원래 옵션을 찾아 되돌린다.
  const handleChange = (values: string[]) => {
    onChange(
      values.map(
        (value) => field.options.find((option) => String(option.value) === value)?.value ?? value
      )
    );
  };

  return (
    <Popover.Root>
      {/* Chip은 ref를 안쪽 라벨 버튼에 연결하므로 팝오버 위치 기준은 칩 전체로 따로 지정한다. */}
      <Popover.Anchor asChild>
        <div className="inline-flex">
          <Popover.Trigger asChild>
            <Chip
              label={field.label}
              onRemove={onRemove}
              valueLabel={field.options
                .filter((option) => selected.includes(option.value))
                .map((option) => option.label)}
            />
          </Popover.Trigger>
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={6}>
          <MultiSelect
            variant="control"
            options={field.options.map((option) => ({
              value: String(option.value),
              label: option.label,
            }))}
            value={selected.map(String)}
            onChange={handleChange}
            aria-label={`${field.label} 선택`}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
