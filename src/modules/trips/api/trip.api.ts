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
    userIds?: string[]
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

    const { data, error } = await query;
    if (error) throw error;

    // Debug: Log the raw data to see what we're getting
    console.log("Raw trip data:", data);

    const parsed = data.map((trip) => {
      try {
        const parsedTrip = tripListResponseSchema.parse(trip);
        console.log("Parsed trip users:", parsedTrip.users);
        return parsedTrip;
      } catch (parseError) {
        console.error("Zod parsing error for trip:", trip.id, parseError);
        throw parseError;
      }
    });

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