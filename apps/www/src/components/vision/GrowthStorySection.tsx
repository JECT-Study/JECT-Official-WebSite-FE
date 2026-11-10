import { Phrases } from "./Phrases";

export function GrowthStorySection() {
  return (
    <section
      data-theme="dark"
      className="flex justify-center bg-surface-shallower px-margin-lg pt-margin-2xl pb-margin-5xl"
    >
      <div className="flex w-full max-w-content flex-col items-center gap-24 py-80 text-center">
        <p className="font-title text-title-1 font-title-subtle text-object-bolder">
          지금까지와 앞으로의 <span className="text-accent-normal">젝트</span>
        </p>
        <h2 className="font-title text-title-3 font-title-normal text-object-boldest">
          <Phrases phrases={["젝트는", "약 1년 6개월만에", "11배 성장을", "이뤄냈어요."]} />
        </h2>
        <div className="flex flex-col gap-8 font-body text-body-lg font-body-bold text-object-bold">
          <p>우리는 구성원 9명의 소규모 그룹에서 시작해 누적 구성원 100명 이상을 달성했습니다.</p>
          <p>
            더 많은 사람들과 경험을 나누고, 함께 몰입하고, 성장하기 위해 이 성장세를 유지하고자
            해요.
          </p>
          <p>우리는 100개의 팀 프로젝트 완성을 다음 목표로 설정했으며,</p>
          <p>정기 밋업과 해커톤을 포함해 지속적인 네트워킹을 이어갈 계획입니다.</p>
        </div>
        <p className="font-title text-title-2 font-title-subtle text-object-boldest">
          <Phrases phrases={["젝트의 다음 이야기를", "함께 응원해주세요!"]} />
        </p>
      </div>
    </section>
  );
}
