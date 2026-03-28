import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { accidentApi } from "../api/accident.api";
import { accidentKeys } from "../constants/accident.key";
import { AccidentFilters, accidentFiltersSchema, AccidentListResponse } from "../schemas/accident.schema";

interface AccidentPage {
  data: AccidentListResponse[];
  nextPage: number | null;
}

const DEFAULT_FILTERS: AccidentFilters = { status: "all" };

export const useAccidentsQuery = (filters: AccidentFilters = DEFAULT_FILTERS) => {
  const queryClient = useQueryClient();

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    // Validate the filters before setting query data (Optional but safe)
    const validatedFilters = accidentFiltersSchema.parse(filters);

    queryClient.setQueryData<InfiniteData<AccidentPage>>(
      accidentKeys.list(validatedFilters),
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

  return useInfiniteQuery<AccidentPage>({
    queryKey: accidentKeys.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      accidentApi.get(pageParam as number, filters), // Pass filters to API
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};