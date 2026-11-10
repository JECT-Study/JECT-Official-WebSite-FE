import { createPortal } from "react-dom";

import { BlockButton } from "@jects/jds";

import { useHeaderActionSlot } from "@/components/layout/Header.context";

export default function SubmittedRecruitAppliesPage() {
  const headerActionSlot = useHeaderActionSlot();

  return (
    <section className="flex flex-col">
      {headerActionSlot &&
        createPortal(
          <BlockButton feedback="positive" prefixIcon="save" className="max-desktop:hidden">
            검토 확정
          </BlockButton>,
          headerActionSlot
        )}
      <div className="flex items-center gap-28 px-margin-lg py-12 desktop:px-margin-xl">
        {/* TODO: 공고 정보를 받을 API가 정해지면 제목을 연결한다. */}
        <h2 className="min-w-0 flex-1 text-title-2 font-title-subtle break-keep text-object-boldest">
          젝트 메이커스 팀 프론트엔드 개발자(FE) 모집
        </h2>
        <div className="flex shrink-0 items-center gap-16 max-desktop:hidden">
          <BlockButton hierarchy="primary" variant="outlined" size="sm" prefixIcon="clock-3">
            변경 이력
          </BlockButton>
          <BlockButton
            hierarchy="accent"
            variant="outlined"
            size="sm"
            prefixIcon="table-of-contents"
          >
            예비번호 조정
          </BlockButton>
        </div>
      </div>
    </section>
  );
}
