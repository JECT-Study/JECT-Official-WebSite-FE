export const ROUTES = {
  main: "/",
  vision: "/vision",
  activity: "/activity",
  curriculum: "/curriculum",
  miniStudy: "/mini-study",
  teamProject: "/team-projects",
  faq: "/faq",
  project: "/project",

  apply: "/apply",
  applyList: "/apply/list",
  applyGuide: "/apply/guide",
  applyFunnel: "/apply/funnel",
  applyContinue: "/apply/continue",
  resetPin: "/auth/reset-pin",

  maintenance: "/maintenance",
  serviceUnavailable: "/service-unavailable",
} as const;

/** 동적 세그먼트를 채운 이동 경로를 만든다. `<Link href>`에는 이 함수의 반환값을 사용한다. */
export const routeTo = {
  main: () => ROUTES.main,
  faq: (tabId?: string, questionId?: string) =>
    [ROUTES.faq, tabId, questionId].filter(Boolean).join("/"),
  projectDetail: (id: string) => `${ROUTES.project}/${id}`,
  applyGuide: (jobFamily: string) => `${ROUTES.applyGuide}/${jobFamily}`,
  applyFunnel: (jobFamily: string) => `${ROUTES.applyFunnel}/${jobFamily}`,
  applyContinue: (jobFamily: string) => `${ROUTES.applyContinue}/${jobFamily}`,
} as const;
