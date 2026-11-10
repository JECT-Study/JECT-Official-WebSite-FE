import { MAKERS_1, MAKERS_2, SUPPORTERS } from "@/constants/members";

import { MakerCard } from "./MakerCard";
import { MemberTabs } from "./MemberTabs";
import { SectionHeading } from "./SectionHeading";
import { SupporterCard } from "./SupporterCard";

const MAKERS_GRID = "grid grid-cols-1 gap-16 tablet:grid-cols-2";

export function MemberSection() {
  return (
    <section className="flex flex-col gap-32">
      <SectionHeading
        label={
          <>
            <span className="text-accent-normal">젝트</span>를 만드는 사람들
          </>
        }
        titlePhrases={[
          "열정 넘치는 구성원들이",
          "젝트에 직접 기여하며",
          "많은 가치를 창출하고",
          "있습니다.",
        ]}
      />
      <MemberTabs
        tabs={[
          {
            value: "supporters",
            label: "운영 서포터즈",
            className: "grid grid-cols-2 gap-16 tablet:grid-cols-4",
            content: SUPPORTERS.map((supporter) => (
              <SupporterCard key={supporter.name} supporter={supporter} />
            )),
          },
          {
            value: "makers-1",
            label: "메이커스 1팀",
            className: MAKERS_GRID,
            content: MAKERS_1.map((maker) => <MakerCard key={maker.name} maker={maker} />),
          },
          {
            value: "makers-2",
            label: "메이커스 2팀",
            className: MAKERS_GRID,
            content: MAKERS_2.map((maker) => <MakerCard key={maker.name} maker={maker} />),
          },
        ]}
      />
    </section>
  );
}
