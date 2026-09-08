// 기존 앱과 새 앱이 함께 지켜야 할 URL 계약이며 마이그레이션 진척도를 겸한다.
// 페이지를 옮길 때마다 해당 항목의 migrated를 true로 수정한다.

export interface RouteContract {
  path: string;
  /** false면 새 앱 대상 스모크에서 건너뛴다. */
  migrated: boolean;
}

export const ROUTE_CONTRACT: RouteContract[] = [
  { path: "/", migrated: true },
  { path: "/vision", migrated: false },
  { path: "/activity", migrated: false },
  { path: "/curriculum", migrated: false },
  { path: "/mini-study", migrated: false },
  { path: "/team-projects", migrated: false },
  { path: "/faq", migrated: false },
  { path: "/apply", migrated: false },
];

export const LEGACY_REDIRECTS = [
  { from: "/apply/verify", to: "/apply" },
  { from: "/apply/applicant-info", to: "/apply" },
  { from: "/apply/registration", to: "/apply" },
  { from: "/apply/complete", to: "/apply" },
];
