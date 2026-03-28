import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { receiptApi } from "../api/receipt.api";
import { receiptKeys } from "../constants/receipt.key";
import { ReceiptListResponse, ReceiptFilters } from "../schemas/receipt.schema";

interface ReceiptPage {
  data: ReceiptListResponse[];
  nextPage: number | null;
}

export const useReceiptsQuery = (filters: ReceiptFilters = {}) => {
  const queryClient = useQueryClient();

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    queryClient.setQueryData<InfiniteData<ReceiptPage>>(
      receiptKeys.list(filters),
      (oldData) => {
        if (!oldData || oldData.pages.length <= 1) return oldData;
        return {
          pages: oldData.pages.slice(0, 1),
          pageParams: oldData.pageParams.slice(0, 1),
        };
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, filterKey]);

  return useInfiniteQuery<ReceiptPage>({
    queryKey: receiptKeys.list(filters),
    queryFn: ({ pageParam = 0 }) => receiptApi.get(pageParam as number, filters),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};