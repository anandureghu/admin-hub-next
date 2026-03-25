import * as z from "zod";
import { userSchema } from "./user.schema";
import { vehicleSchema } from "./vehicle.schema";
import { workSessionSchema } from "./work.schema";

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
  vehicles: vehicleSchema.nullable(),
  users: z
    .object({
      name: z.string(),
      email: z.string(),
    })
    .nullable(),
  // Add the array of work sessions here
  work_sessions: z.array(workSessionSchema).default([]),
  start_image: z.string().nullable(),
  end_image: z.string().nullable(),
});

export type Trip = z.infer<typeof tripSchema>;
export type TripListResponse = z.infer<typeof tripListResponseSchema>;
export type TripDetailResponse = z.infer<typeof tripDetailResponseSchema>;
