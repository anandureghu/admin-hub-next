import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Trip, tripSchema } from "../schemas/trip.schema";
import { User } from "@supabase/supabase-js";

export const tripApi = {
  async get(user: User | null): Promise<Trip[]> {
    if (!user) throw new Error("No active session");

    const { data, error } = await supabase
      .from("trips")
      .select(
        `*, vehicles(vehicle_number, vehicle_type), users!inner(auth_user_id)`,
      )
      .eq("users.auth_user_id", user.id)
      .order("trip_date", { ascending: false });

    if (error) throw error;
    return data.map((trip) => tripSchema.parse(trip));
  },

  async getById(id: string): Promise<Trip> {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return tripSchema.parse(data);
  },

  async create(
    data: Omit<Trip, "id" | "created_at" | "updated_at" | "user_id">,
  ): Promise<Trip> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No active session");

    // Get user_id from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (userError) throw userError;

    const insertData = {
      ...data,
      user_id: userData.id,
    } as Database["public"]["Tables"]["trips"]["Insert"];
    const { data: tripData, error } = await supabase
      .from("trips")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return tripSchema.parse(tripData);
  },

  async update(
    id: string,
    data: Partial<Omit<Trip, "id" | "created_at" | "updated_at">>,
  ): Promise<Trip> {
    const { data: tripData, error } = await supabase
      .from("trips")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return tripSchema.parse(tripData);
  },
};
