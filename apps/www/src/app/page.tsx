import type { Metadata } from "next";

import {
  GoalSection,
  HeroSection,
  IntroSection,
  JoinSection,
  LandingScroll,
} from "@/components/landing";
import { BASE_OPEN_GRAPH } from "@/constants/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  alternates: { canonical: ROUTES.main },
  openGraph: { ...BASE_OPEN_GRAPH, url: ROUTES.main },
};

export default function HomePage() {
  return (
    <LandingScroll>
      <HeroSection />
      <IntroSection />
      <GoalSection />
      <JoinSection />
    </LandingScroll>
  );
}
