import { Steps } from "@jects/jds";

const STEP_LABELS = ["이메일 인증", "프로필 작성", "지원서 작성"];

interface ApplyProgressProps {
  current: number;
}

export function ApplyProgress({ current }: ApplyProgressProps) {
  return (
    <Steps.Root size="md" current={current}>
      {STEP_LABELS.map((label, index) => (
        <Steps.Item key={label} index={index}>
          {label}
        </Steps.Item>
      ))}
    </Steps.Root>
  );
}
