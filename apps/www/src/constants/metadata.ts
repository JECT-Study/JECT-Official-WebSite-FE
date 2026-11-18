import type { Metadata } from "next";

import ogImage from "@/assets/images/og-image.png";

export const SITE_NAME = "젝트";

export const SITE_DESCRIPTION =
  "젝트(JECT)는 다양한 포지션 멤버들과 협업할 수 있는 IT 사이드 프로젝트 동아리예요. 홈페이지에서 더 자세한 내용을 확인해보세요!";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const DEFAULT_IMAGES = [{ url: ogImage.src, width: ogImage.width, height: ogImage.height }];

/** 페이지에서 openGraph를 지정하면 루트 값을 대체하므로 이 값을 펼친 뒤 덧붙인다. */
export const BASE_OPEN_GRAPH = {
  type: "website",
  siteName: SITE_NAME,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  locale: "ko_KR",
  images: DEFAULT_IMAGES,
} satisfies NonNullable<Metadata["openGraph"]>;

export const BASE_TWITTER = {
  card: "summary_large_image",
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  images: DEFAULT_IMAGES,
} satisfies NonNullable<Metadata["twitter"]>;

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  images?: NonNullable<Metadata["openGraph"]>["images"];
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images,
}: PageMetadataOptions): Metadata {
  const shareTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: shareTitle,
      description,
      ...(path && { url: path }),
      ...(images && { images }),
    },
    twitter: {
      ...BASE_TWITTER,
      title: shareTitle,
      description,
      ...(images && { images }),
    },
  };
}
