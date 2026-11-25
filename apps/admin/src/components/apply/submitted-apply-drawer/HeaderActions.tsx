import { DropdownMenu, IconButton, LabelButton } from "@jects/jds";

interface ViewingActionsProps {
  disabled: boolean;
  onEdit: () => void;
}

export function ViewingActions({ disabled, onEdit }: ViewingActionsProps) {
  return (
    <div className="flex items-center gap-16 max-tablet:hidden">
      <LabelButton hierarchy="tertiary" size="md" disabled={disabled} onClick={onEdit}>
        편집
      </LabelButton>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton hierarchy="tertiary" size="lg" icon="ellipsis" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={12} className="w-[160px]">
          <DropdownMenu.Group>
            <DropdownMenu.Button prefixIcon="clock-3" prefixIconVisible>
              변경 이력
            </DropdownMenu.Button>
            {/* JDS 메뉴 항목에 색 옵션이 없어 아이콘과 라벨에 직접 지정한다. */}
            <DropdownMenu.Button
              prefixIcon="trash"
              prefixIconVisible
              className="*:text-feedback-destructive-neutral"
            >
              삭제
            </DropdownMenu.Button>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

interface EditingActionsProps {
  onCancel: () => void;
}

export function EditingActions({ onCancel }: EditingActionsProps) {
  return (
    <div className="flex items-center gap-16">
      <LabelButton hierarchy="tertiary" size="md" onClick={onCancel}>
        편집 취소
      </LabelButton>
      <LabelButton hierarchy="accent" size="md">
        저장하기
      </LabelButton>
    </div>
  );
}
