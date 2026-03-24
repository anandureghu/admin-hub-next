import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { tripApi } from "../api/trip.api";
import { tripKeys } from "../constants/trip.key";
import { TripListResponse } from "../schemas/trip.schema";

interface TripPage {
  data: TripListResponse[];
  nextPage: number | null;
}

export const useTripsQuery = (status?: string, userIds?: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData<InfiniteData<TripPage>>(
      tripKeys.get(status, userIds),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          pages: oldData.pages.slice(0, 1),
          pageParams: oldData.pageParams.slice(0, 1),
        };
      }
    );
  }, [queryClient, status, userIds]);

  return useInfiniteQuery<TripPage>({
    queryKey: tripKeys.get(status, userIds),
    queryFn: ({ pageParam = 0 }) =>
      tripApi.get(pageParam as number, status, userIds),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};