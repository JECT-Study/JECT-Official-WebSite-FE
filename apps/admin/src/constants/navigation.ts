import { ROUTES } from "@/constants/routes";

export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationSection {
  name: string;
  links: NavigationLink[];
}

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    name: "지원서 관리",
    links: [
      { label: "제출 완료 지원서", href: ROUTES.submittedApplies },
      { label: "임시 저장 지원서", href: ROUTES.draftApplies },
    ],
  },
  {
    name: "구성원 관리",
    links: [
      { label: "일반 구성원", href: ROUTES.members },
      { label: "메이커스 팀", href: ROUTES.makerMembers },
      { label: "운영 서포터즈", href: ROUTES.supporterMembers },
    ],
  },
  {
    name: "단체 메일 관리",
    links: [
      { label: "템플릿 설정", href: ROUTES.mailTemplates },
      { label: "메일 발송", href: ROUTES.mailSend },
    ],
  },
  {
    name: "관리자 계정 관리",
    links: [{ label: "관리자 계정 관리", href: ROUTES.accounts }],
  },
];

const LINKS_DESC_BY_LENGTH = NAVIGATION_SECTIONS.flatMap((section) => section.links).sort(
  (a, b) => b.href.length - a.href.length
);

/** 상세 경로에서도 상위 메뉴가 선택되도록 긴 경로부터 확인한다. */
export function findActiveLink(pathname: string): NavigationLink | undefined {
  return LINKS_DESC_BY_LENGTH.find(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
  );
}
