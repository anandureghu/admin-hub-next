import * as z from "zod";

export const vehicleSchema = z.object({
  vehicle_number: z.string(),
  vehicle_type: z.string(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;