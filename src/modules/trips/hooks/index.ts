import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { tripApi } from "../api/trip.api";
import { tripKeys } from "../constants/trip.key";
import { Trip } from "../schemas/trip.schema";

interface TripPage {
  data: Trip[];
  nextPage: number | null;
}

export const useTripsQuery = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData<InfiniteData<TripPage>>(
      tripKeys.get(),
      (oldData) => {
        if (!oldData) return oldData;
        return {
          pages: oldData.pages.slice(0, 1),
          pageParams: oldData.pageParams.slice(0, 1),
        };
      }
    );
  }, [queryClient]);

  return useInfiniteQuery<TripPage>({
    queryKey: tripKeys.get(),
    queryFn: ({ pageParam = 0 }) => tripApi.get(pageParam as number),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};