import * as z from "zod";
import { employeeSchema } from "../../employees/schemas/employee.schema";

export const accidentReportSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid().nullable(),
  user_id: z.string().uuid().nullable(),
  description: z.string().min(1, "Description is required"),
  photo_url: z.string().nullable(),
  location: z.any().nullable(),
  reported_at: z.string(),
  updated_at: z.string().nullable(),
});

export const accidentListResponseSchema = accidentReportSchema.extend({
  users: employeeSchema.nullable(),
  trips: z.object({
    trip_date: z.string(),
    status: z.string(),
  }).nullable(),
});

export const accidentFiltersSchema = z.object({
  status: z.string().optional().default("all"),
  userId: z.string().uuid().optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).optional(),
  search: z.string().optional(),
});

export type AccidentReport = z.infer<typeof accidentReportSchema>;
export type AccidentListResponse = z.infer<typeof accidentListResponseSchema>;
export type AccidentFilters = z.infer<typeof accidentFiltersSchema>;