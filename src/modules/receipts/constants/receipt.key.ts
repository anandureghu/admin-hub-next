// receipts/constants/receipt.key.ts
import { ReceiptFilters } from "../schemas/receipt.schema";

export const receiptKeys = {
  // Base key for all receipt-related queries
  all: ["receipts"] as const,

  // Key for all list-type queries
  lists: () => [...receiptKeys.all, "list"] as const,

  /**
   * Generates a unique key for a filtered list of receipts.
   * This ensures that when filters (search, userId, dateRange) change, 
   * TanStack Query treats it as a new query and handles caching/fetching correctly.
   */
  list: (filters: ReceiptFilters) => [...receiptKeys.lists(), filters] as const,

  /**
   * Key for a specific receipt detail
   */
  detail: (id: string) => [...receiptKeys.all, "detail", id] as const,
};