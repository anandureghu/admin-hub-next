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

export const tripCreateSchema = z.object({
  vehicle_id: z.string().uuid().nullable(),
  trip_date: z.string(), // Date in ISO format
  start_time: z.string().nullable(), // Timestamp in ISO format
  end_time: z.string().nullable(), // Timestamp in ISO format
  start_km: z.number().int().nullable(),
  end_km: z.number().int().nullable(),
  start_location: z.any().nullable(), // Geography type, can be string or object
  end_location: z.any().nullable(), // Geography type, can be string or object
  status: z.enum(["STARTED", "ENDED"]).default("STARTED"),
});

export const tripUpdateSchema = z
  .object({
    vehicle_id: z.string().uuid().nullable().optional(),
    trip_date: z.string().optional(), // Date in ISO format
    start_time: z.string().nullable().optional(), // Timestamp in ISO format
    end_time: z.string().nullable().optional(), // Timestamp in ISO format
    start_km: z.number().int().nullable().optional(),
    end_km: z.number().int().nullable().optional(),
    start_location: z.any().nullable().optional(), // Geography type, can be string or object
    end_location: z.any().nullable().optional(), // Geography type, can be string or object
    status: z.enum(["STARTED", "ENDED"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type Trip = z.infer<typeof tripSchema>;

export type TripCreate = z.infer<typeof tripCreateSchema>;
export type TripUpdate = z.infer<typeof tripUpdateSchema>;
