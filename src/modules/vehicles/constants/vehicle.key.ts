import { VehicleFilters } from "../schemas/vehicle.schema";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
};
