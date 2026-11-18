import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [ROUTES.applyFunnel, ROUTES.applyContinue, ROUTES.resetPin, ROUTES.maintenance],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
