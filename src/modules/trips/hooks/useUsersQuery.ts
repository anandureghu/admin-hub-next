import { useQuery } from "@tanstack/react-query";
import { userApi, userKeys } from "../api/user.api";
import { User } from "../schemas/trip.schema";

export const useUsersQuery = () => {
  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: () => userApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};