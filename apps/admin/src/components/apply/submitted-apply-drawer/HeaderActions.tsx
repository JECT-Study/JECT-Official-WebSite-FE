import { DropdownMenu, IconButton, LabelButton } from "@jects/jds";

export function ViewingActions() {
  return (
    <div className="flex items-center gap-16 max-tablet:hidden">
      <LabelButton hierarchy="tertiary" size="md">
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
