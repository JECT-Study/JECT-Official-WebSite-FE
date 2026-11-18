import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

const SITEMAP_PATHS = [
  ROUTES.main,
  ROUTES.vision,
  ROUTES.curriculum,
  ROUTES.miniStudy,
  ROUTES.teamProject,
  ROUTES.faq,
  ROUTES.applyList,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS.map((path) => ({ url: new URL(path, SITE_URL).href }));
}
