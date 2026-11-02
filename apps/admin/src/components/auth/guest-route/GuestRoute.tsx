import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { routeTo } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) return <Navigate to={routeTo.home()} replace />;

  return children;
}
