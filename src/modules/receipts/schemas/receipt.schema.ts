// schemas/receipt.schema.ts
import * as z from "zod";

export const receiptSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().nullable(),
  description: z.string().nullable(),
  receipt_url: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export const receiptListResponseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().nullable(),
  description: z.string().nullable(),
  receipt_url: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),

  // Joined relations
  users: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .default(null),

  trips: z
    .object({
      id: z.string(),
      trip_date: z.string(),
    })
    .nullable()
    .default(null),
});

export const receiptFiltersSchema = z.object({
  search: z.string().optional(),
  userId: z.string().uuid().optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

export type Receipt = z.infer<typeof receiptSchema>;
export type ReceiptListResponse = z.infer<typeof receiptListResponseSchema>;
export type ReceiptFilters = z.infer<typeof receiptFiltersSchema>;