import { supabase } from "@/integrations/supabase/client";

export const workApi = {
  async getByTripId(tripId: string) {
    const { data, error } = await supabase
      .from("work_sessions")
      .select(`*`)
      .eq("trip_id", tripId)
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("work_sessions")
      .select(`*, trips(*)`)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
};