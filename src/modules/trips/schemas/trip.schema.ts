import * as z from "zod";

export const tripSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  vehicle_id: z.string().uuid().nullable(),
  trip_date: z.string(), // Date in ISO format
  start_time: z.string().nullable(), // Timestamp in ISO format
  end_time: z.string().nullable(), // Timestamp in ISO format
  start_km: z.number().int().nullable(),
  end_km: z.number().int().nullable(),
  start_location: z.any().nullable(), // Geography type, can be string or object
  end_location: z.any().nullable(), // Geography type, can be string or object
  status: z.enum(["STARTED", "ENDED"]).default("STARTED"),
  created_at: z.string(), // Timestamp in ISO format
  updated_at: z.string().optional(), // Timestamp in ISO format
});

export type Trip = z.infer<typeof tripSchema>;
