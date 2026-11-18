import { IconButton, type IconName, Tooltip } from "@jects/jds";

interface ToolbarButtonProps {
  label: string;
  icon: IconName;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ToolbarButton({ label, icon, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton
          icon={icon}
          size="lg"
          hierarchy="tertiary"
          condensed={false}
          aria-pressed={active}
          disabled={disabled}
          onClick={onClick}
          className="aria-pressed:bg-fill-boldest/8"
        />
      </Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}
