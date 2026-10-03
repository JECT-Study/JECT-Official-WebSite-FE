import type { FilterField, FilterOptionValue, FilterValues } from "./Filter.types";
import FilterAddButton from "./FilterAddButton";
import FilterChip from "./FilterChip";

interface FilterProps {
  fields: FilterField[];
  values: FilterValues;
  onValuesChange: (values: FilterValues) => void;
}

export default function Filter({ fields, values, onValuesChange }: FilterProps) {
  const addedFields = Object.keys(values)
    .map((fieldId) => fields.find((field) => field.id === fieldId))
    .filter((field) => field !== undefined);

  const addableFields = fields.filter((field) => !(field.id in values));

  const handleAddFilter = (fieldId: string) => {
    onValuesChange({ ...values, [fieldId]: [] });
  };

  const handleRemoveFilter = (fieldId: string) => {
    onValuesChange(Object.fromEntries(Object.entries(values).filter(([id]) => id !== fieldId)));
  };

  const handleChangeOptions = (fieldId: string, selected: FilterOptionValue[]) => {
    onValuesChange({ ...values, [fieldId]: selected });
  };

  return (
    <div className="flex flex-row items-center gap-8">
      {addedFields.map((field) => (
        <FilterChip
          key={field.id}
          field={field}
          selected={values[field.id] ?? []}
          onChange={(selected) => handleChangeOptions(field.id, selected)}
          onRemove={() => handleRemoveFilter(field.id)}
        />
      ))}
      <FilterAddButton fields={addableFields} onAdd={handleAddFilter} />
    </div>
  );
}
