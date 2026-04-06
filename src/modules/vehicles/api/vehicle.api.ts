import { supabase } from "@/integrations/supabase/client";
import { VehicleFilters, Vehicle, vehicleSchema } from "../schemas/vehicle.schema";
import { Database } from "@/integrations/supabase/types";

export const vehicleApi = {
  async get(page = 0, itemSize = 9, filters: VehicleFilters = {}): Promise<{ data: Vehicle[]; nextPage: number | null }> {
    const from = page * itemSize;
    const to = from + itemSize - 1;

    let query = supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.search?.trim()) {
      query = query.or(
        `vehicle_number.ilike.%${filters.search.trim()}%,vehicle_type.ilike.%${filters.search.trim()}%`
      );
    }

    if (filters.status === "available") {
      query = query.eq("is_active", true);
    } else if (filters.status === "unavailable") {
      query = query.eq("is_active", false);
    }

    const { data, error } = await query;

    if (error) throw error;

    const parsed = (data || []).map((item) => vehicleSchema.parse(item));

    return {
      data: parsed,
      nextPage: data.length === itemSize ? page + 1 : null,
    };
  },

  async create(vehicle: VehicleInsert): Promise<Vehicle> {
    const { data, error } = await supabase
      .from("vehicles")
      .insert(vehicle)
      .select()
      .single();

    if (error) throw error;
    return vehicleSchema.parse(data);
  },

  async update(id: string, updates: VehicleUpdate): Promise<Vehicle> {
    const { data, error } = await supabase
      .from("vehicles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return vehicleSchema.parse(data);
  },

  async toggleStatus(id: string, currentStatus: boolean): Promise<void> {
    const { error } = await supabase
      .from("vehicles")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) throw error;
  },

  async uploadImage(vehicleId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const filePath = `${vehicleId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("vehicles")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "no-cache",
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("vehicles").getPublicUrl(filePath);
    return `${data.publicUrl}?t=${Date.now()}`;
  }
};


export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];