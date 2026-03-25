export const tripKeys = {
  all: ["trips"] as const,
  get: (status?: string, userIds?: string[], dateRange?: { from: Date; to: Date }) =>
    [...tripKeys.all, "list", status || "all", userIds ?? [], dateRange ? `${dateRange.from?.toISOString()}-${dateRange.to?.toISOString()}` : "no-date"] as const,
  detail: (id: string) => [...tripKeys.all, "detail", id] as const,
};