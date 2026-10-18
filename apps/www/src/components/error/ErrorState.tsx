import { Fragment, type ReactNode } from "react";
import Link from "next/link";

import { BlockButton, Icon } from "@jects/jds";

import { ROUTES } from "@/constants/routes";

interface ErrorStateProps {
  /** 줄바꿈 단위로 나눈 제목이다. 좁은 화면에서 이 단위로만 줄을 바꾼다. */
  title: string[];
  description: string;
  action?: ReactNode;
}

function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center pt-40 pb-40">
      <section className="flex w-full max-w-narrow flex-col items-center gap-32 px-margin-lg pt-margin-xl pb-margin-3xl">
        <Icon name="circle-alert" size="5xl" className="text-object-boldest" aria-hidden />
        <div className="flex w-full flex-col items-center gap-16">
          <h1 className="flex flex-wrap justify-center gap-x-6 gap-y-4 font-title text-title-4 font-title-normal text-object-boldest">
            {/* flex 안의 공백은 렌더링되지 않으므로 간격은 유지하고 텍스트에만 띄어쓰기를 남긴다. */}
            {title.map((chunk, index) => (
              <Fragment key={chunk}>
                {index > 0 && " "}
                <span className="whitespace-nowrap">{chunk}</span>
              </Fragment>
            ))}
          </h1>
          <p className="text-center font-body text-body-md font-body-normal whitespace-pre-line text-object-bold">
            {description}
          </p>
        </div>
        {action}
      </section>
    </div>
  );
}

export function NotFoundState() {
  return (
    <ErrorState
      title={["페이지를", "찾을 수", "없습니다"]}
      description="잘못된 주소를 입력했거나, 삭제된 페이지예요."
      action={
        <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
          <Link href={ROUTES.main}>메인 페이지로</Link>
        </BlockButton>
      }
    />
  );
}

export function ServiceErrorState() {
  return (
    <ErrorState
      title={["현재 페이지를", "불러오는 중", "문제가 생겼습니다"]}
      description={
        "일시적인 오류일 수 있으니, 잠시 후 다시 시도해주세요.\n" +
        "문제가 지속된다면 jectofficial@ject.kr 로 문의해주세요."
      }
      action={
        <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
          {/* Next.js는 경로가 바뀔 때만 에러 화면을 초기화하므로 메인 페이지에서 발생한 에러는 Link로 벗어날 수 없다.
              문서를 새로 불러오도록 a를 사용한다. */}
          <a href={ROUTES.main}>메인 페이지로</a>
        </BlockButton>
      }
    />
  );
}

export function MaintenanceState() {
  return (
    <ErrorState
      title={["현재 서비스를", "점검 중입니다"]}
      description={
        "서비스 점검은 가능한 빠르게 마무리 될 예정이며,\n" +
        "필요 시 jectofficial@ject.kr 로 문의해주세요."
      }
    />
  );
}
