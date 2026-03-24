import { supabase } from "@/integrations/supabase/client";
import { User, userSchema } from "../schemas/trip.schema";

export const userApi = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, avatar_url, role")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data.map((user) => userSchema.parse(user));
  },
};

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
};