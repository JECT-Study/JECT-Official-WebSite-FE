import Image from "next/image";
import Link from "next/link";

import { BlockButton } from "@jects/jds";

import applyCompleteImage from "@/assets/images/apply-complete.png";
import { routeTo } from "@/constants/routes";

export function CompleteStep() {
  return (
    <section className="flex flex-col gap-margin-3xl">
      <Image
        src={applyCompleteImage}
        alt=""
        placeholder="blur"
        className="aspect-7/3 w-full border border-stroke-alpha-subtler object-cover"
      />
      <div className="flex flex-col gap-12">
        <h1 className="font-title text-title-4 font-title-normal text-object-boldest">
          지원이 완료되었습니다
        </h1>
        <p className="font-body text-body-sm text-object-bold">
          젝트에 관심을 갖고 지원해주셔서 감사드립니다!
          <br />
          작성해 주신 지원서는 꼼꼼히 확인할 예정이며, 함께 활동하게 될 날들을 기대하겠습니다.
        </p>
      </div>
      <BlockButton asChild hierarchy="accent" size="md" className="self-start">
        <Link href={routeTo.main()}>메인 페이지로 이동하기</Link>
      </BlockButton>
    </section>
  );
}
