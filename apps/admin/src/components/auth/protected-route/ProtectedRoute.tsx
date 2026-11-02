import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) return <Navigate to={ROUTES.login} replace />;

  return children;
}
