export const tripKeys = {
  all: ["trips"] as const,
  get: (status?: string, userIds?: string[]) =>
    [...tripKeys.all, "list", status || "all", userIds ?? []] as const,
  detail: (id: string) => [...tripKeys.all, "detail", id] as const,
};