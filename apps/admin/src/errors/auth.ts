import { ROUTES, routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

// 전체 새로고침으로 이전 세션의 쿼리 캐시도 함께 비운다.
export function handleAuthFailure() {
  useAuthStore.getState().setIsLoggedIn(false);

  const { pathname, search } = window.location;
  if (pathname !== ROUTES.login) window.location.replace(routeTo.login(pathname + search));
}
