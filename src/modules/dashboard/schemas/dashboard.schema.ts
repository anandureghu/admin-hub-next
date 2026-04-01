import * as z from "zod";

export const dashboardStatsSchema = z.object({
  totalEmployees: z.number(),
  activeVehicles: z.number(),
  activeTrips: z.number(),
  totalReceipts: z.number(),
});

export const recentTripSchema = z.object({
  id: z.string().uuid(),
  trip_date: z.string(),
  status: z.enum(["STARTED", "ENDED"]),
  users: z.object({ name: z.string() }).nullable(),
  vehicles: z.object({ vehicle_number: z.string() }).nullable(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type RecentTrip = z.infer<typeof recentTripSchema>;
