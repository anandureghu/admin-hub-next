// api/receipt.api.ts
import { supabase } from "@/integrations/supabase/client";
import {
  ReceiptListResponse,
  receiptListResponseSchema,
  ReceiptFilters,
} from "../schemas/receipt.schema";

const PAGE_SIZE = 24;

export const receiptApi = {
  async get(
    page = 0,
    filters: ReceiptFilters = {},
  ): Promise<{ data: ReceiptListResponse[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from("receipts").select("id, amount, description, receipt_url, created_at, updated_at, users(id, name), trips(id, trip_date)");

    if (filters.userId) query = query.eq("user_id", filters.userId);
    if (filters.search)
      query = query.ilike("description", `%${filters.search}%`);

    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte("created_at", filters.dateRange.from.toISOString())
        .lte("created_at", filters.dateRange.to.toISOString());
    }

    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Zod will now successfully parse the nested objects!
    const parsed = (data || []).map((item) =>
      receiptListResponseSchema.parse(item),
    );

    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  },
};
