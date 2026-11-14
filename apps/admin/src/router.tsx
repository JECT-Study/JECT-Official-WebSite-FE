import { createBrowserRouter } from "react-router-dom";

import { GuestRoute } from "@/components/auth/guest-route/GuestRoute";
import { ProtectedRoute } from "@/components/auth/protected-route/ProtectedRoute";
import RootLayout from "@/components/layout/RootLayout";
import { ROUTES } from "@/constants/routes";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SubmittedAppliesPage from "@/pages/SubmittedAppliesPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.submittedApplies, element: <SubmittedAppliesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
