import { useState } from "react";

import { BlockButton, Select } from "@jects/jds";
// JDS에 Popover가 추가되면 그쪽으로 교체한다.
import { Popover } from "radix-ui";

import type { FilterField } from "./Filter.types";

interface FilterAddButtonProps {
  fields: FilterField[];
  onAdd: (fieldId: string) => void;
}

export default function FilterAddButton({ fields, onAdd }: FilterAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (fieldId: string) => {
    onAdd(fieldId);
    setIsOpen(false);
  };

  return (
    <Popover.Root modal open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <BlockButton
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
