import { type Ref, useState } from "react";

import { BlockButton, Select } from "@jects/jds";
// JDS에 Popover가 추가되면 그쪽으로 교체한다.
import { Popover } from "radix-ui";

import type { FilterField } from "./Filter.types";

interface FilterAddButtonProps {
  ref?: Ref<HTMLButtonElement>;
  fields: FilterField[];
  onAdd: (fieldId: string) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export default function FilterAddButton({
  ref,
  fields,
  onAdd,
  onCloseAutoFocus,
}: FilterAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (fieldId: string) => {
    onAdd(fieldId);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <BlockButton
          ref={ref}
          hierarchy="secondary"
          size="xs"
          variant="hollow"
          prefixIcon="plus"
          disabled={fields.length === 0}
        >
          필터 추가
        </BlockButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-floated *:max-h-(--radix-popover-content-available-height)"
          onCloseAutoFocus={onCloseAutoFocus}
          // 포털로 드로어 밖에 렌더링되어 드로어의 스크롤 잠금에 막히므로, document에 닿기 전에 휠/터치 전파를 멈춘다.
          onWheel={(event) => {
            event.stopPropagation();
          }}
          onTouchMove={(event) => {
            event.stopPropagation();
          }}
        >
          <Select
            width="200px"
            options={fields.map((field) => ({ value: field.id, label: field.label }))}
            value={null}
            onChange={handleAdd}
            aria-label="추가할 필터 선택"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
