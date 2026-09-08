import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/components/layout/RootLayout";
import { ROUTES } from "@/constants/routes";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
