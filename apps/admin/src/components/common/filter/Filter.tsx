import { useLayoutEffect, useRef } from "react";

import type { FilterField, FilterOptionValue, FilterValues } from "./Filter.types";
import FilterAddButton from "./FilterAddButton";
import FilterChip from "./FilterChip";

interface FilterProps {
  fields: FilterField[];
  values: FilterValues;
  onValuesChange: (values: FilterValues) => void;
}

export default function Filter({ fields, values, onValuesChange }: FilterProps) {
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<{
    removedFieldId: string;
    nextFieldId: string | undefined;
  } | null>(null);

  // 칩이 빠지고 필터 추가 버튼이 활성화된 뒤에 포커스해야 해서, 부모가 제거를 반영한 렌더링 후에 옮긴다.
  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (pending === null || pending.removedFieldId in values) return;
    pendingFocusRef.current = null;
    const target = pending.nextFieldId
      ? chipRefs.current.get(pending.nextFieldId)
      : addButtonRef.current;
    target?.focus();
  });

  const addedFields = Object.keys(values)
    .map((fieldId) => fields.find((field) => field.id === fieldId))
    .filter((field) => field !== undefined);

  const addableFields = fields.filter((field) => !(field.id in values));

  const handleAddFilter = (fieldId: string) => {
    onValuesChange({ ...values, [fieldId]: [] });
  };

  const handleRemoveFilter = (fieldId: string) => {
    const nextField = addedFields[addedFields.findIndex((field) => field.id === fieldId) + 1];
    pendingFocusRef.current = {
      removedFieldId: fieldId,
      nextFieldId: nextField?.id,
    };
    onValuesChange(Object.fromEntries(Object.entries(values).filter(([id]) => id !== fieldId)));
  };

  const handleChangeOptions = (fieldId: string, selected: FilterOptionValue[]) => {
    onValuesChange({ ...values, [fieldId]: selected });
  };

  // 마지막 필터를 추가하면 트리거가 비활성화되어 Radix의 포커스 복귀가 실패하므로 마지막 칩으로 옮긴다.
  const handleAddButtonCloseAutoFocus = (event: Event) => {
    if (addableFields.length > 0) return;
    event.preventDefault();
    const lastField = addedFields.at(-1);
    if (lastField) chipRefs.current.get(lastField.id)?.focus();
  };

  return (
    <div className="flex flex-row items-center gap-8">
      {addedFields.map((field) => (
        <FilterChip
          key={field.id}
          ref={(element) => {
            if (element) chipRefs.current.set(field.id, element);
            else chipRefs.current.delete(field.id);
          }}
          field={field}
          selected={values[field.id] ?? []}
          onChange={(selected) => handleChangeOptions(field.id, selected)}
          onRemove={() => handleRemoveFilter(field.id)}
        />
      ))}
      <FilterAddButton
        ref={addButtonRef}
        fields={addableFields}
        onAdd={handleAddFilter}
        onCloseAutoFocus={handleAddButtonCloseAutoFocus}
      />
    </div>
  );
}
