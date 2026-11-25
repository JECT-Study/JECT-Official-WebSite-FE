import { ToastProvider } from "@jects/jds";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/apis/queryClient";
import { GlobalDialog } from "@/components/common/global-dialog/GlobalDialog";
import { router } from "@/router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
        <GlobalDialog />
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
