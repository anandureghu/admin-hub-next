import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appConfigApi } from "../api/appConfig.api";
import { AppConfigFormValues } from "../schemas/appConfig.schema";

export const useAppConfigKeys = {
  all: ["app_config"] as const,
  active: () => [...useAppConfigKeys.all, "active"] as const,
  list: () => [...useAppConfigKeys.all, "list"] as const,
};

export function useActiveAppConfig() {
  return useQuery({
    queryKey: useAppConfigKeys.active(),
    queryFn: () => appConfigApi.getActive(),
  });
}

export function useAllAppConfigs() {
  return useQuery({
    queryKey: useAppConfigKeys.list(),
    queryFn: () => appConfigApi.getAll(),
  });
}

export function useUpsertAppConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppConfigFormValues) => appConfigApi.upsert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useAppConfigKeys.all });
    },
  });
}

export function useDeleteAppConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appConfigApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useAppConfigKeys.all });
    },
  });
}
