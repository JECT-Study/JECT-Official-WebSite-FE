import type { RowSelectionState } from "@tanstack/react-table";

export function deselectRows(
  selection: RowSelectionState,
  rowIds: (string | number)[]
): RowSelectionState {
  const next = { ...selection };
  for (const rowId of rowIds) delete next[rowId];
  return next;
}
