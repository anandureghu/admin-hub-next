import { supabase } from "@/integrations/supabase/client";
import { AppConfigFormValues, AppConfig, appConfigSchema } from "../schemas/appConfig.schema";

export const appConfigApi = {
  async getActive(): Promise<AppConfig | null> {
    const { data, error } = await supabase
      .from("app_config")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return appConfigSchema.parse(data);
  },

  async getAll(): Promise<AppConfig[]> {
    const { data, error } = await supabase
      .from("app_config")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((item) => appConfigSchema.parse(item));
  },

  async upsert(payload: AppConfigFormValues) {
    if (payload.is_active) {
      // Deactivate all other configs if this one is active
      const updateQuery = supabase.from("app_config").update({ is_active: false });
      if (payload.id) {
        await updateQuery.neq("id", payload.id);
      } else {
        await updateQuery.neq("id", "00000000-0000-0000-0000-000000000000"); // Deactivate all
      }
    }

    const dbPayload = {
      ...payload,
      apk_url: payload.apk_url || null, // Convert empty string to null
    };

    if (payload.id) {
      const { error } = await supabase
        .from("app_config")
        .update(dbPayload)
        .eq("id", payload.id);
      if (error) throw error;
    } else {
      const { id, ...insertPayload } = dbPayload;
      const { error } = await supabase.from("app_config").insert([insertPayload]);
      if (error) throw error;
    }
  },

  async delete(id: string) {
    const { error } = await supabase.from("app_config").delete().eq("id", id);
    if (error) throw error;
  },
};
