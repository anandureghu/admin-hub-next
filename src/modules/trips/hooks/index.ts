import { useQuery } from "@tanstack/react-query";
import { tripApi } from "../api/trip.api";
import { tripKeys } from "../constants/trip.key";
import {
  Trip,
  TripCreate,
  TripUpdate,
  tripSchema,
  tripCreateSchema,
  tripUpdateSchema,
} from "../schemas/trip.schema";
import { useCurrentUserQuery } from "../../../hooks/useCurrentUser";
import { User } from "@supabase/supabase-js";
import { Trip } from "../schemas/trip.schema";

// use trip queries
export const useTripsQuery = () => {
  //   const { data: user } = useCurrentUserQuery();

  return useQuery<Trip[]>({
    queryKey: tripKeys.get(),
    queryFn: () => tripApi.get(),
  });
};
