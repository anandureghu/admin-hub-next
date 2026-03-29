import { supabase } from "@/integrations/supabase/client";
import { AccidentFilters, AccidentListResponse, accidentListResponseSchema } from "../schemas/accident.schema";

const PAGE_SIZE = 10;

export const accidentApi = {
  async get(page = 0, filters: AccidentFilters = {}): Promise<{ data: AccidentListResponse[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("accident_reports")
      .select(`
        *,
        users (*),
        trips (trip_date, status)
      `)
      .order("reported_at", { ascending: false })
      .range(from, to);

    if (filters.userIds && filters.userIds.length > 0) {
      query = query.in("user_id", filters.userIds);
    }
    if (filters.search)
      query = query.ilike("description", `%${filters.search}%`);

    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte("reported_at", filters.dateRange.from.toISOString())
        .lte("reported_at", filters.dateRange.to.toISOString());
    }

    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const parsed = (data || []).map((item) => accidentListResponseSchema.parse(item));
    
    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  }
};