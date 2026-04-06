import * as z from "zod";

export const vehicleTypes = [
  "Sedan",
  "SUV",
  "Truck",
  "Van",
  "Ford Transit",
  "Pickup",
  "Bus",
  "Motorcycle",
  "Other",
] as const;

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  vehicle_number: z.string().min(1, "Vehicle number is required"),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  is_active: z.boolean().default(true),
  created_at: z.string(),
  image_url: z.string().nullable().optional(),
});

export const vehicleFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "available", "unavailable"]).optional(),
});

export const vehicleFormSchema = z.object({
  vehicle_number: z.string().min(1, "Vehicle number is required"),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleFilters = z.infer<typeof vehicleFiltersSchema>;
export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
