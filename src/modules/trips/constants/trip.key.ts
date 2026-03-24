export const tripKeys = {
  all: ["trips"] as const,
  get: (status?: string) => [...tripKeys.all, "list", status || "all"] as const,
  detail: (id: string) => [...tripKeys.all, "detail", id] as const,
};