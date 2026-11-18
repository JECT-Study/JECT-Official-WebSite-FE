export const projectQueryKeys = {
  all: ["project"] as const,
  list: (category: string | null) => [...projectQueryKeys.all, "list", category] as const,
};
