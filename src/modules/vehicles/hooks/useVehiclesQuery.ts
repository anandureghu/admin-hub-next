import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { vehicleApi } from "../api/vehicle.api";
import { vehicleKeys } from "../constants/vehicle.key";
import { VehicleFilters, Vehicle, vehicleFiltersSchema } from "../schemas/vehicle.schema";

interface VehiclePage {
  data: Vehicle[];
  nextPage: number | null;
}

const DEFAULT_FILTERS: VehicleFilters = { search: "" };

export const useVehiclesQuery = (filters: VehicleFilters = DEFAULT_FILTERS, itemSize = 9) => {
  const queryClient = useQueryClient();
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    const validatedFilters = vehicleFiltersSchema.parse(filters);

    queryClient.setQueryData<InfiniteData<VehiclePage>>(
      vehicleKeys.list(validatedFilters),
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

  return useInfiniteQuery<VehiclePage>({
    queryKey: vehicleKeys.list(filters),
    queryFn: ({ pageParam = 0 }) => 
      vehicleApi.get(pageParam as number, itemSize, filters),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
