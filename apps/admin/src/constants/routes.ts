export const ROUTES = {
  home: "/",
  submittedApplies: "/applies/submitted",
  draftApplies: "/applies/drafts",
  members: "/members",
  makerMembers: "/members/makers",
  supporterMembers: "/members/supporters",
  mailTemplates: "/mails/templates",
  mailSend: "/mails/send",
  accounts: "/accounts",
} as const;

/** 동적 세그먼트를 채운 이동 경로를 만든다. `<Link to>`에는 이 함수의 반환값을 사용한다. */
export const routeTo = {
  home: () => ROUTES.home,
} as const;
