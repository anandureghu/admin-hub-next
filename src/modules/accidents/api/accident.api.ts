import { supabase } from "@/integrations/supabase/client";
import { AccidentListResponse, accidentListResponseSchema } from "../schemas/accident.schema";

const PAGE_SIZE = 10;

export const accidentApi = {
  async get(page = 0): Promise<{ data: AccidentListResponse[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("accident_reports")
      .select(`
        *,
        users (*),
        trips (trip_date, status)
      `)
      .order("reported_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const parsed = (data || []).map((item) => accidentListResponseSchema.parse(item));
    
    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  }
};