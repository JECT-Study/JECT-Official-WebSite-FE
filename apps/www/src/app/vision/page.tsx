import type { Metadata } from "next";

import { Divider } from "@jects/jds";

import { GrowthStorySection, MemberSection, VisionHero, VisionSection } from "@/components/vision";

export const metadata: Metadata = {
  title: "비전과 스토리",
};

export default function VisionPage() {
  return (
    <>
      <div className="flex justify-center px-margin-lg pt-[calc(var(--gnb-height)+var(--spacing-margin-2xl))] pb-margin-2xl">
        <div className="flex w-full max-w-content flex-col">
          <VisionHero />
          <div className="flex flex-col gap-48 pt-margin-xl pb-margin-3xl">
            <VisionSection
              label={
                <>
                  프로<span className="text-accent-normal">젝트</span> 시작
                </>
              }
              titlePhrases={[
                "젝트는 개발자들의",
                "소규모 사이드 프로젝트",
                "모임으로 시작했습니다.",
              ]}
              paragraphs={[
                "프로젝트를 진행하면서, 개발자뿐만 아니라 여러 다양한 포지션들과의 협업을 경험하는 것이 더 입체적으로 성장할 수 있다고 판단했어요.",
                "뒤이어 IT 관련 다양한 포지션들을 구성원으로 영입하며 동아리 규모를 확대하고 있습니다.",
                "지금에 이르러 젝트는 구성원들이 팀 프로젝트 활동과 학습을 통해 함께 성장하는 커뮤니티 허브가 되었습니다.",
              ]}
            />
            <Divider />
            <VisionSection
              label={
                <>
                  <span className="text-accent-normal">젝트</span>의 목표
                </>
              }
              titlePhrases={["우리는", "IT 생태계의 선순환을", "목표로 활동하고", "있습니다."]}
              paragraphs={[
                "젝트는 협업 경험과 피드백을 통한 학습, 인적 네트워크를 구성원들에게 제공합니다.",
                "이를 통해 성장한 구성원은 곧 IT 생태계의 인적 자원으로서 전문성을 발휘하며 활동을 이어나가고,",
                "구성원들이 자연스레 젝트가 추구하는 가치를 전파하고, 다른 이들과 경험을 나누는 선순환이 지속되게 하는 것이 목표입니다.",
              ]}
            />
            <Divider />
            <MemberSection />
          </div>
        </div>
      </div>
      <GrowthStorySection />
    </>
  );
}
