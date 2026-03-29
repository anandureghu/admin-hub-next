import * as z from "zod";

// Base Employee Schema
export const employeeSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.enum(["ADMIN", "EMPLOYEE"]), // Strict enum handles the 'string' error
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  auth_user_id: z.string().nullable(),
});

const nestedTripSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  vehicle_id: z.string().uuid().nullable(),
  trip_date: z.string(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  start_km: z.number().nullable(),
  end_km: z.number().nullable(),
  status: z.enum(["STARTED", "ENDED"]),
  created_at: z.string(),
  updated_at: z.string(),
  start_image: z.string().nullable(),
  end_image: z.string().nullable(),
  // Use z.any() for locations since they are Geography objects from Supabase
  start_location: z.any().nullable(),
  end_location: z.any().nullable(),
  current_location: z.any().nullable(),
  // Add these as optional because the backend JSON you shared doesn't include them
  vehicles: z.object({ vehicle_number: z.string(), vehicle_type: z.string().nullable() }).nullable().optional(),
  users: z.object({ name: z.string() }).nullable().optional(),
});

const nestedWorkSessionSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string().nullable(),
  notes: z.string().nullable(),
  location: z.any().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const employeeResponseSchema = z.object({
  data: z.array(employeeSchema),
  count: z.number(),
});

export const employeeFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export const tripSchema = z.object({
  id: z.string().uuid(),
  destination: z.string(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  start_date: z.string(),
  end_date: z.string().nullable(),
  user_id: z.string().uuid(),
});

// --- Base Work Schema ---
export const workSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  due_date: z.string().nullable(),
  user_id: z.string().uuid(),
});


// --- Employee Detail (With Relations) ---
export const employeeDetailSchema = employeeSchema.extend({
  trips: z.array(nestedTripSchema).default([]),
  work_sessions: z.array(nestedWorkSessionSchema).default([]),
});

// --- Mutation Payloads ---
export const createEmployeeSchema = employeeSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true, 
  auth_user_id: true 
});
export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeResponse = z.infer<typeof employeeResponseSchema>;
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial();

// --- Types ---
export type EmployeeDetail = z.infer<typeof employeeDetailSchema>;
export type Trip = z.infer<typeof tripSchema>;
export type Work = z.infer<typeof workSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;