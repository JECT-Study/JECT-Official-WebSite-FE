import {
  GoalSection,
  HeroSection,
  IntroSection,
  JoinSection,
  LandingScroll,
} from "@/components/landing";

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
