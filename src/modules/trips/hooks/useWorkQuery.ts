import { useQuery } from "@tanstack/react-query";
import { workApi } from "../api/work.api";
import { workKeys } from "../constants/work.key";

export const useWorkSessionsQuery = (tripId: string) => {
  return useQuery({
    queryKey: workKeys.byTrip(tripId),
    queryFn: () => workApi.getByTripId(tripId),
    enabled: !!tripId,
  });
};

export const useWorkDetailQuery = (workId: string) => {
  return useQuery({
    queryKey: workKeys.detail(workId),
    queryFn: () => workApi.getById(workId),
    enabled: !!workId,
  });
};