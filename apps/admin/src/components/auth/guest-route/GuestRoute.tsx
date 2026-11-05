import type { ReactNode } from "react";

import { Navigate, useSearchParams } from "react-router-dom";

import { ROUTES, routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestRouteProps {
  children: ReactNode;
}

// redirect 값은 URL로 조작할 수 있으므로 같은 오리진의 경로만 허용한다.
function getRedirectPath(redirect: string | null) {
  if (!redirect || !URL.canParse(redirect, window.location.origin)) return routeTo.home();

  const url = new URL(redirect, window.location.origin);
  if (url.origin !== window.location.origin || url.pathname === ROUTES.login) {
    return routeTo.home();
  }

  return url.pathname + url.search + url.hash;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchParams] = useSearchParams();

  if (isLoggedIn) return <Navigate to={getRedirectPath(searchParams.get("redirect"))} replace />;

  return children;
}
