import { EXTERNAL_LINKS } from "@/constants/links";
import { ROUTES } from "@/constants/routes";

export interface NavigationLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavigationSection {
  name: string;
  links: NavigationLink[];
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    name: "젝트",
    links: [
      { label: "비전과 스토리", href: ROUTES.vision },
      { label: "활동 커리큘럼", href: ROUTES.curriculum },
      { label: "JDS", href: EXTERNAL_LINKS.jdsFigma, isExternal: true },
    ],
  },
  {
    name: "프로그램",
    links: [
      { label: "팀 프로젝트", href: ROUTES.teamProject },
      { label: "미니 스터디", href: ROUTES.miniStudy },
    ],
  },
  {
    name: "합류 가이드",
    links: [
      { label: "지원 안내", href: ROUTES.applyList },
      { label: "FAQ", href: ROUTES.faq },
    ],
  },
];
