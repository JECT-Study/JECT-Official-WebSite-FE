import { createBrowserRouter } from "react-router-dom";

import { GuestRoute } from "@/components/auth/guest-route/GuestRoute";
import { ProtectedRoute } from "@/components/auth/protected-route/ProtectedRoute";
import RootLayout from "@/components/layout/RootLayout";
import { ROUTES } from "@/constants/routes";
import AccountsPage from "@/pages/AccountsPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";

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
      { path: ROUTES.accounts, element: <AccountsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
