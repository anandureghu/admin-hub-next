import * as z from "zod";

export const tripSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  vehicle_id: z.string().uuid().nullable(),
  trip_date: z.string(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  start_km: z.number().int().nullable(),
  end_km: z.number().int().nullable(),
  start_location: z.any().nullable(),
  end_location: z.any().nullable(),
  status: z.enum(["STARTED", "ENDED"]).default("STARTED"),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const vehicleSchema = z.object({
  vehicle_number: z.string(),
  vehicle_type: z.string(),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  is_active: z.boolean().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
});

export const tripListResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  vehicle_id: z.string().uuid().nullable(),
  trip_date: z.string(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  start_km: z.number().int().nullable(),
  end_km: z.number().int().nullable(),
  start_location: z.any().nullable(),
  end_location: z.any().nullable(),
  status: z.enum(["STARTED", "ENDED"]).default("STARTED"),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  vehicles: vehicleSchema.nullable(),
  users: userSchema.nullable(),
});

export const tripDetailResponseSchema = tripSchema.extend({
  vehicles: vehicleSchema.optional(),
  users: userSchema.optional(),
});

export type Trip = z.infer<typeof tripSchema>;
export type TripListResponse = z.infer<typeof tripListResponseSchema>;
export type TripDetailResponse = z.infer<typeof tripDetailResponseSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type User = z.infer<typeof userSchema>;