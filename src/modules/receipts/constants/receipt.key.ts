import { ReceiptFilters } from "../schemas/receipt.schema";

export const receiptKeys = {
  all: ["receipts"] as const,
  lists: () => [...receiptKeys.all, "list"] as const,
  list: (filters: ReceiptFilters) => [...receiptKeys.lists(), filters] as const,
  detail: (id: string) => [...receiptKeys.all, "detail", id] as const,
};