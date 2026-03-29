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

    if (filters.userIds && filters.userIds.length > 0) {
      query = query.in("user_id", filters.userIds);
    }
    if (filters.search)
      query = query.ilike("description", `%${filters.search}%`);

    if (filters.dateRange?.from) {
      // Set from date to start of day (00:00:00)
      const fromDate = new Date(filters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      // Use the 'to' date if it exists, otherwise fall back to the 'from' date for a single-day query
      const toDate = new Date(filters.dateRange.to || filters.dateRange.from);
      toDate.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString());
    }

    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const parsed = (data || []).map((item) =>
      receiptListResponseSchema.parse(item),
    );

    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  },
};
