export const workKeys = {
  all: ["work_sessions"] as const,
  byTrip: (tripId: string) => [...workKeys.all, "trip", tripId] as const,
  detail: (id: string) => [...workKeys.all, "detail", id] as const,
};