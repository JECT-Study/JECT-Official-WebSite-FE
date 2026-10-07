import type { Ref } from "react";

import { Chip, MultiSelect } from "@jects/jds";
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
  return (
    <Popover.Root>
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
          // MultiSelect가 className을 받지 않아 `*:`로 JDS DOM 구조에 의존한다. JDS Popover로 교체할 때 정리한다.
          className="z-floated *:max-h-(--radix-popover-content-available-height)"
          // 포털로 드로어 밖에 렌더링되어 드로어의 스크롤 잠금에 막히므로, document에 닿기 전에 휠/터치 전파를 멈춘다.
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
        >
          <MultiSelect
            width="200px"
            variant="control"
            options={field.options.map((option) => ({
              value: String(option.value),
              label: option.label,
            }))}
            value={selected.map(String)}
            // JDS는 문자열을 돌려주고, Filter가 normalizeFilterValues로 원래 옵션 값으로 되돌린다.
            onChange={onChange}
            aria-label={`${field.label} 선택`}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
