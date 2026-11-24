"use client";

import { type ReactNode, useEffect } from "react";

import { ToastProvider } from "@jects/jds";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/apis/queryClient";
import { GlobalDialog } from "@/components/common/global-dialog/GlobalDialog";
import { restoreTheme } from "@/hooks/useTheme";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    restoreTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <GlobalDialog />
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
