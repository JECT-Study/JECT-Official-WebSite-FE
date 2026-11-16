import { type Ref, useState } from "react";

import { Chip, MultiSelect, Select } from "@jects/jds";
// JDS에 Popover가 추가되면 그쪽으로 교체한다.
import { Popover } from "radix-ui";

import type { FilterField, FilterOptionValue } from "./Filter.types";

interface FilterChipProps {
  ref?: Ref<HTMLButtonElement>;
  field: FilterField;
  selected: FilterOptionValue[];
  onChange: (values: FilterOptionValue[]) => void;
  onRemove: () => void;
}

export default function FilterChip({ ref, field, selected, onChange, onRemove }: FilterChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = field.options.map((option) => ({
    value: String(option.value),
    label: option.label,
  }));

  const handleSelect = (value: string) => {
    onChange([value]);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Chip은 ref를 안쪽 라벨 버튼에 연결하므로 팝오버 위치 기준은 칩 전체로 따로 지정한다. */}
      <Popover.Anchor asChild>
        <div className="inline-flex">
          <Popover.Trigger asChild>
            <Chip
              ref={ref}
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
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-floated"
          // 포털로 드로어 밖에 렌더링되어 드로어의 스크롤 잠금에 막히므로, document에 닿기 전에 휠/터치 전파를 멈춘다.
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
        >
          {/* JDS는 문자열을 돌려주고, Filter가 normalizeFilterValues로 원래 옵션 값으로 되돌린다. */}
          {field.selectionMode === "single" ? (
            <Select
              width="200px"
              maxHeight="var(--radix-popover-content-available-height)"
              variant="control"
              options={options}
              value={selected[0] === undefined ? null : String(selected[0])}
              onChange={handleSelect}
              aria-label={`${field.label} 선택`}
            />
          ) : (
            <MultiSelect
              width="200px"
              maxHeight="var(--radix-popover-content-available-height)"
              variant="control"
              options={options}
              value={selected.map(String)}
              onChange={onChange}
              aria-label={`${field.label} 선택`}
            />
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
