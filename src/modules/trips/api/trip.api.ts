import { supabase } from "@/integrations/supabase/client";
import {
  Trip,
  tripListResponseSchema,
  tripDetailResponseSchema,
} from "../schemas/trip.schema";

const PAGE_SIZE = 10;

export const tripApi = {
  async get(
    page = 0,
    status?: string,
    userIds?: string[],
    dateRange?: { from: Date; to: Date }
  ): Promise<{ data: Trip[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("trips")
      .select(
        `*,
        vehicles(vehicle_number, vehicle_type),
        users(id, name, email, phone, avatar_url, role, is_active, company_id)`
      )
      .order("trip_date", { ascending: false })
      .range(from, to);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }

    if (dateRange?.from && dateRange?.to) {
      // Set from date to start of day (00:00:00)
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      // Set to date to end of day (23:59:59.999)
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    const parsed = data.map((trip) => tripListResponseSchema.parse(trip));
    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  },

  async getById(id: string): Promise<Trip> {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return tripDetailResponseSchema.parse(data);
  },
};