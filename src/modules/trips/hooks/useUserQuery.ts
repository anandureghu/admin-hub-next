import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { userKeys } from "../constants/user.key";
import { User } from "../schemas/user.schema";

export const useUsersQuery = () => {
  return useQuery<User[]>({
    queryKey: userKeys.list(),
    queryFn: () => userApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};