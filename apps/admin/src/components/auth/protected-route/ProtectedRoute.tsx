import type { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { pathname, search } = useLocation();

  if (!isLoggedIn) return <Navigate to={routeTo.login(pathname + search)} replace />;

  return children;
}
