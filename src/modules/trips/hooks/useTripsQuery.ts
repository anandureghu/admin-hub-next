import { useInfiniteQuery, useQueryClient, InfiniteData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { tripApi } from "../api/trip.api";
import { tripKeys } from "../constants/trip.key";
import { TripListResponse } from "../schemas/trip.schema";
import { DateRange } from "react-day-picker";

interface TripPage {
  data: TripListResponse[];
  nextPage: number | null;
}

export const useTripsQuery = (status?: string, userIds?: string[], dateRange?: DateRange) => {
  const queryClient = useQueryClient();

  const filterKey = JSON.stringify({ status, userIds, dateRange });

  useEffect(() => {
    queryClient.setQueryData<InfiniteData<TripPage>>(
      tripKeys.get(status, userIds, dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined),
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

  return useInfiniteQuery<TripPage>({
    queryKey: tripKeys.get(status, userIds, dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined),
    queryFn: ({ pageParam = 0 }) =>
      tripApi.get(pageParam as number, status, userIds, dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

export const useTripDetailQuery = (id: string) => {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripApi.getById(id),
    enabled: !!id, // Only run the query if an ID exists
    staleTime: 1000 * 60 * 5, // Optional: keep data fresh for 5 mins
  });
};