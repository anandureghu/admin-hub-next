import { supabase } from "@/integrations/supabase/client";
import {
  Trip,
  tripListResponseSchema,
  tripDetailResponseSchema,
  TripDetailResponse,
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

    // REFACTORED DATE LOGIC
    if (dateRange?.from) {
      // Set from date to start of day (00:00:00)
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      // Use the 'to' date if it exists, otherwise fall back to the 'from' date for a single-day query
      const toDate = new Date(dateRange.to || dateRange.from);
      toDate.setHours(23, 59, 59, 999);

      query = query
        .gte("trip_date", fromDate.toISOString())
        .lte("trip_date", toDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    const parsed = data.map((trip) => tripListResponseSchema.parse(trip));
    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  },

  async getById(id: string): Promise<TripDetailResponse> {
  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      vehicles (
        vehicle_number, 
        vehicle_type
      ),
      users (
        name, 
        email
      ),
      work_sessions (
        id,
        start_time,
        end_time,
        notes,
        location,
        created_at
      ),
      receipts (
        id,
        amount,
        description,
        image_url,
        created_at,
        updated_at,
        users(id, name),
        trips(id, trip_date)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  
  return tripDetailResponseSchema.parse(data);
}
};