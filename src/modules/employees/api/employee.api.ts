import { supabase } from "@/integrations/supabase/client";
import { Employee, EmployeeDetail, employeeDetailSchema, EmployeeResponse, employeeSchema } from "../schemas/employee.schema";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

export const employeeApi = {
  async get(
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState
  ): Promise<EmployeeResponse> {
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    // Sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      query = query.order(id, { ascending: !desc });
    } else {
      query = query.order("created_at", { ascending: false }).order("name", { ascending: true });
    }

    // Filters
    filters.forEach((filter) => {
      if (filter.value === undefined || filter.value === null || filter.value === "") return;

      if (filter.id === "name") {
        const searchTerm = filter.value as string;
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      if (filter.id === "role") {
        query = query.eq("role", filter.value as string);
      }

      if (filter.id === "is_active") {
        query = query.eq("is_active", filter.value as boolean);
      }
    });

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      data: data.map((item) => employeeSchema.parse(item)),
      count: count ?? 0,
    };
  },

  async upsert(id: string | null, payload: Partial<Employee>) {
    if (id) {
      const { error } = await supabase.from("users").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("users").insert({
        email: payload.email!,
        name: payload.name!,
        phone: payload.phone,
        avatar_url: payload.avatar_url,
        company_id: payload.company_id,
        created_at: payload.created_at,
        role: "EMPLOYEE",
        is_active: true,
      });
      if (error) throw error;
    }
  },

  async toggleStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (error) throw error;
  },

  async getById(id: string): Promise<EmployeeDetail> {
    const { data, error } = await supabase
      .from("users")
      .select(`
      *,
      trips (*, users(name), vehicles(vehicle_number, vehicle_type)),
      work_sessions (*)
    `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return employeeDetailSchema.parse(data);
  },

  async getEmployeeActivity(userId: string) {
    const tripsPromise = supabase
      .from("trips")
      .select(`*, vehicles(vehicle_number, vehicle_type)`)
      .eq("user_id", userId)
      .order("trip_date", { ascending: false });

    // Fetch work sessions
    const sessionsPromise = supabase
      .from("work_sessions")
      .select(`*`)
      .eq("user_id", userId)
      .order("start_time", { ascending: false });

    const [tripsRes, sessionsRes] = await Promise.all([tripsPromise, sessionsPromise]);

    if (tripsRes.error) throw tripsRes.error;
    if (sessionsRes.error) throw sessionsRes.error;

    return {
      trips: tripsRes.data,
      sessions: sessionsRes.data,
    };
  },

  async resetDevice(id: string) {
    const { error } = await supabase
      .from("users")
      .update({ device_id: null } as Partial<Employee>)
      .eq("id", id);

    if (error) throw error;
  },
};