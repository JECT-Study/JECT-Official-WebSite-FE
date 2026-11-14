"use client";

import { Suspense } from "react";

import { useFunnel } from "@use-funnel/browser";

import type { JobFamily } from "@/apis/recruit/schemas";
import { useIsClient } from "@/hooks/useIsClient";

import { ApplyFunnelHeader } from "./ApplyFunnelHeader";
import { ApplyProgress } from "./ApplyProgress";
import { ApplicationStep, CompleteStep, IdentityVerificationStep, ProfileStep } from "./steps";

const PROGRESS_INDEX = {
  profile: 1,
  application: 2,
} as const;

interface ContinueFunnelProps {
  recruitId: number;
  recruitTitle: string;
  jobFamily: JobFamily;
  jobFamilyName: string;
}

function Funnel({ recruitId, recruitTitle, jobFamily, jobFamilyName }: ContinueFunnelProps) {
  const funnel = useFunnel<{
    identityVerification: object;
    profile: object;
    application: object;
    complete: object;
  }>({
    id: "continue-funnel",
    initial: { step: "identityVerification", context: {} },
  });

  return (
    <div className="flex flex-col gap-48">
      <ApplyFunnelHeader
        recruitId={recruitId}
        navigationTitle={funnel.step === "identityVerification" ? "이어서 작성하기" : recruitTitle}
      >
        {(funnel.step === "profile" || funnel.step === "application") && (
          <ApplyProgress current={PROGRESS_INDEX[funnel.step]} />
        )}
      </ApplyFunnelHeader>
      <funnel.Render
        identityVerification={({ history }) => (
          <IdentityVerificationStep
            recruitId={recruitId}
            // 본인 확인 후 뒤로 가기로 본인 확인 단계에 돌아오지 않게 한다.
            onNext={(step) => history.replace(step, {})}
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
        application={({ history }) => (
          <Suspense fallback={null}>
            <ApplicationStep recruitId={recruitId} onNext={() => history.replace("complete", {})} />
          </Suspense>
        )}
        complete={() => <CompleteStep />}
      />
    </div>
  );
}

export function ContinueFunnel(props: ContinueFunnelProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <Funnel {...props} />;
}
