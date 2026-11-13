import { Dialog } from "@jects/jds";

interface DeactivateAccountsDialogProps {
  open: boolean;
  count: number;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeactivateAccountsDialog({
  open,
  count,
  isPending,
  onOpenChange,
  onConfirm,
}: DeactivateAccountsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      header={`계정 ${count}개를 비활성화하시겠습니까?`}
      body="비활성화한 계정은 백오피스에 로그인할 수 없습니다."
      primaryAction={{ children: "비활성화", onClick: onConfirm, disabled: isPending }}
      secondaryAction={{ children: "취소", onClick: () => onOpenChange(false) }}
    />
  );
}
