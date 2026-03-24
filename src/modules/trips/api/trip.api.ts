import { supabase } from "@/integrations/supabase/client";
import { Trip, tripListResponseSchema, tripDetailResponseSchema } from "../schemas/trip.schema";

const PAGE_SIZE = 10;

export const tripApi = {
  async get(page = 0, status?: string): Promise<{ data: Trip[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("trips")
      .select(`*, vehicles(vehicle_number, vehicle_type), users(id, name, email, phone, avatar_url, role)`)
      .order("trip_date", { ascending: false })
      .range(from, to);

    // Apply status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
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