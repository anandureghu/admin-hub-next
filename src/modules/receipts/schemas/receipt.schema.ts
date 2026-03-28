import * as z from "zod";
import { employeeSchema } from "../../employees/schemas/employee.schema";

export const receiptSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid().nullable(),
  user_id: z.string().uuid().nullable(),
  amount: z.number().nullable(),
  description: z.string().nullable(),
  receipt_url: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export const receiptListResponseSchema = receiptSchema.extend({
  users: employeeSchema.nullable(),
  trips: z.object({
    trip_date: z.string(),
    status: z.string(),
  }).nullable(),
});

export const receiptFiltersSchema = z.object({
  search: z.string().optional(),
  userId: z.string().uuid().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

export type Receipt = z.infer<typeof receiptSchema>;
export type ReceiptListResponse = z.infer<typeof receiptListResponseSchema>;
export type ReceiptFilters = z.infer<typeof receiptFiltersSchema>;