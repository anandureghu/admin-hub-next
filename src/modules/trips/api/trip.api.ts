import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  Trip,
  tripSchema,
  tripListResponseSchema,
  tripDetailResponseSchema,
} from "../schemas/trip.schema";

export const tripApi = {
  async get(): Promise<Trip[]> {
    const { data, error } = await supabase
      .from("trips")
      .select(`*, vehicles(vehicle_number, vehicle_type)`)
      .order("trip_date", { ascending: false });

    if (error) throw error;
    return data.map((trip) => tripListResponseSchema.parse(trip));
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
