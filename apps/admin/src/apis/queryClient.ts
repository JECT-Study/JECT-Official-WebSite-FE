import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1m
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
