import type { Metadata } from "next";

export const SITE_NAME = "젝트";

export const SITE_DESCRIPTION =
  "젝트(JECT)는 다양한 포지션 멤버들과 협업할 수 있는 IT 사이드 프로젝트 동아리예요. 홈페이지에서 더 자세한 내용을 확인해보세요!";

/** 페이지에서 openGraph를 지정하면 루트 값을 대체하므로 이 값을 펼친 뒤 덧붙인다. */
export const BASE_OPEN_GRAPH = {
  type: "website",
  siteName: SITE_NAME,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  locale: "ko_KR",
} satisfies NonNullable<Metadata["openGraph"]>;
