import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, RecentTrip } from "../schemas/dashboard.schema";

export const dashboardApi = {
  async getOverview(): Promise<{ stats: DashboardStats; recentTrips: RecentTrip[] }> {
    // 1. Calculate the start and end of the current day
    const today = new Date();
    
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      { count: employeeCount },
      { count: vehicleCount },
      { count: tripCount },
      { count: receiptCount },
      { data: tripsData }
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }).eq("is_active", true).eq("role", "EMPLOYEE"),
      supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("is_active", true),
      
      supabase
        .from("trips")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString()),
        
      supabase.from("receipts").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase
        .from("trips")
        .select("id, trip_date, status, user_id, vehicle_id, vehicles(vehicle_number), users(name)")
        .order("created_at", { ascending: false })
        .limit(5)
    ]);

    const stats: DashboardStats = {
      totalEmployees: employeeCount || 0,
      activeVehicles: vehicleCount || 0,
      activeTrips: tripCount || 0, // This is now "Today's Trips"
      totalReceipts: receiptCount || 0,
    };

    const recentTrips = (tripsData as unknown as RecentTrip[])?.map(t => ({
      id: t.id,
      trip_date: t.trip_date,
      status: t.status,
      users: t.users,
      vehicles: t.vehicles
    })) || [];

    return { stats, recentTrips };
  }
};
