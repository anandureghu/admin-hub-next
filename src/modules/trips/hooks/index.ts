import { useQuery } from "@tanstack/react-query";
import { tripApi } from "../api/trip.api";
import { tripKeys } from "../constants/trip.key";
import { Trip } from "../schemas/trip.schema";

// use trip queries
export const useTripsQuery = () => {
  return useQuery<Trip[]>({
    queryKey: tripKeys.get(),
    queryFn: () => tripApi.get(),
  });
};
