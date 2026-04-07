import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Trip,
  tripListResponseSchema,
  tripDetailResponseSchema,
  TripDetailResponse,
} from "../schemas/trip.schema";

const PAGE_SIZE = 10;

export const tripApi = {
  async get(
    page = 0,
    status?: string,
    userIds?: string[],
    dateRange?: { from?: Date; to?: Date },
  ): Promise<{ data: Trip[]; nextPage: number | null }> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("trips")
      .select(
        `*,
        vehicles(vehicle_number, vehicle_type),
        users(id, name, email, phone, avatar_url, role, is_active, company_id)`,
      )
      .order("trip_date", { ascending: false })
      .range(from, to);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }

    if (dateRange?.from) {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      const toStr = format(dateRange.to || dateRange.from, "yyyy-MM-dd");

      query = query
        .gte("trip_date", fromStr)
        .lte("trip_date", toStr + "T23:59:59.999Z");
    }

    const { data, error } = await query;
    if (error) throw error;

    const parsed = data.map((trip) => tripListResponseSchema.parse(trip));
    return {
      data: parsed,
      nextPage: parsed.length === PAGE_SIZE ? page + 1 : null,
    };
  },

  async getById(id: string): Promise<TripDetailResponse> {
    const { data, error } = await supabase
      .from("trips")
      .select(
        `
      *,
      vehicles (vehicle_number, vehicle_type),
      users (name, email),
      work_sessions (id, start_time, end_time, notes, location, created_at),
      receipts (id, amount, description, image_url, created_at, updated_at, users(id, name), trips(id, trip_date)),
      vehicle_photos (id, photo_type, photo_url, taken_at),
      accident_reports (id, description, photo_url, location, created_at)
    `,
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return tripDetailResponseSchema.parse(data);
  },

  async exportTrips(
    status?: string,
    userIds?: string[],
    dateRange?: { from?: Date; to?: Date },
  ) {
    let query = supabase
      .from("trips")
      .select(
        `
      *,
      vehicles(vehicle_number, vehicle_type),
      users(name, email),
      work_sessions(start_time, end_time, notes),
      accident_reports(description, created_at),
      receipts(amount, description, created_at)
    `,
      )
      .order("trip_date", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }
    if (dateRange?.from) {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      const toStr = format(dateRange.to || dateRange.from, "yyyy-MM-dd");
      query = query
        .gte("trip_date", fromStr)
        .lte("trip_date", toStr + "T23:59:59.999Z");
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  },

  // Add this inside your tripApi object
  async getExportCount(
    status?: string,
    userIds?: string[],
    dateRange?: { from?: Date; to?: Date }
  ): Promise<number> {
    let query = supabase
      .from("trips")
      .select("*", { count: "exact", head: true }); // head: true means "don't fetch data, just count"

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }

    if (dateRange?.from) {
      const fromDate = format(dateRange.from, "yyyy-MM-dd");
      const toDate = dateRange.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : fromDate;

      query = query
        .gte("trip_date", fromDate)
        .lte("trip_date", toDate + "T23:59:59.999Z");
    }

    const { count, error } = await query;
    if (error) throw error;

    return count || 0;
  },
};

