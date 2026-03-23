export const tripKeys = {
  all: ["trips"] as const,
  get: () => [...tripKeys.all, "list"] as const,
  detail: (id: string) => [...tripKeys.all, "detail", id] as const,
};
