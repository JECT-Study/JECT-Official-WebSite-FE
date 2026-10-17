import Link from "next/link";

import { BlockButton, Icon } from "@jects/jds";

import { ROUTES } from "@/constants/routes";

interface ErrorStateProps {
  /** 줄바꿈 단위로 나눈 제목이다. 좁은 화면에서 이 단위로만 줄을 바꾼다. */
  title: string[];
  description: string[];
  withHomeLink?: boolean;
}

function ErrorState({ title, description, withHomeLink = false }: ErrorStateProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center pt-40 pb-40">
      <section className="flex w-full max-w-narrow flex-col items-center px-margin-lg">
        <div className="flex w-full flex-col items-center gap-32 pt-margin-xl pb-margin-3xl">
          <Icon name="circle-alert" size="5xl" className="text-object-boldest" aria-hidden />
          <div className="flex w-full flex-col items-center gap-16">
            <h1 className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-center font-title text-title-4 font-title-normal text-object-boldest">
              {title.map((chunk) => (
                <span key={chunk} className="whitespace-nowrap">
                  {chunk}
                </span>
              ))}
            </h1>
            <div className="text-center font-body text-body-md font-body-normal text-object-bold">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          {withHomeLink && (
            <BlockButton asChild hierarchy="accent" size="lg" suffixIcon="arrow-right">
              <Link href={ROUTES.main}>메인 페이지로</Link>
            </BlockButton>
          )}
        </div>
      </section>
    </div>
  );
}

export function NotFoundState() {
  return (
    <ErrorState
      title={["페이지를", "찾을 수", "없습니다"]}
      description={["잘못된 주소를 입력했거나, 삭제된 페이지예요."]}
      withHomeLink
    />
  );
}

export function ServiceErrorState() {
  return (
    <ErrorState
      title={["현재 페이지를", "불러오는 중", "문제가 생겼습니다"]}
      description={[
        "일시적인 오류일 수 있으니, 잠시 후 다시 시도해주세요.",
        "문제가 지속된다면 jectofficial@ject.kr 로 문의해주세요.",
      ]}
      withHomeLink
    />
  );
}

export function MaintenanceState() {
  return (
    <ErrorState
      title={["현재 서비스를", "점검 중입니다"]}
      description={[
        "서비스 점검은 가능한 빠르게 마무리 될 예정이며,",
        "필요 시 jectofficial@ject.kr 로 문의해주세요.",
      ]}
    />
  );
}
