"use client";

import { useSyncExternalStore } from "react";

import { useFunnel } from "@use-funnel/browser";

import type { JobFamily } from "@/apis/recruit/schemas";

import { ApplyFunnelHeader } from "./ApplyFunnelHeader";
import { ApplyProgress } from "./ApplyProgress";
import { ApplyStepLayout } from "./ApplyStepLayout";
import { EmailVerificationStep, ProfileStep } from "./steps";

const PROGRESS_INDEX = {
  emailVerification: 0,
  profile: 1,
  application: 2,
} as const;

interface ApplyFunnelProps {
  recruitId: number;
  recruitTitle: string;
  jobFamily: JobFamily;
  jobFamilyName: string;
}

function subscribe() {
  return () => {};
}

function Funnel({ recruitId, recruitTitle, jobFamily, jobFamilyName }: ApplyFunnelProps) {
  const funnel = useFunnel<{
    emailVerification: object;
    profile: object;
    application: object;
  }>({
    id: "apply-funnel",
    initial: { step: "emailVerification", context: {} },
  });

  return (
    <div className="flex flex-col gap-48">
      <ApplyFunnelHeader recruitId={recruitId} recruitTitle={recruitTitle}>
        <ApplyProgress current={PROGRESS_INDEX[funnel.step]} />
      </ApplyFunnelHeader>
      <funnel.Render
        emailVerification={({ history }) => (
          <EmailVerificationStep
            recruitId={recruitId}
            // 지원자 등록 후 뒤로 가기로 이메일 인증 단계에 돌아오지 않게 한다.
            onNext={() => history.replace("profile", {})}
          />
        )}
        profile={({ history }) => (
          <ProfileStep
            recruitId={recruitId}
            jobFamily={jobFamily}
            jobFamilyName={jobFamilyName}
            onNext={() => history.push("application", {})}
          />
        )}
        // TODO: 지원서 작성 단계를 구현하면 교체한다.
        application={() => <ApplyStepLayout title="지원서 작성">{null}</ApplyStepLayout>}
      />
    </div>
  );
}

export function ApplyFunnel(props: ApplyFunnelProps) {
  // use-funnel의 step은 브라우저 히스토리에 저장되어 서버에서 알 수 없으므로 클라이언트에서만 렌더링한다.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return null;
  }

  return <Funnel {...props} />;
}
