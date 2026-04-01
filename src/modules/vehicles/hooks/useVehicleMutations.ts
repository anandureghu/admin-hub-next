import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi, VehicleInsert, VehicleUpdate } from "../api/vehicle.api";
import { vehicleKeys } from "../constants/vehicle.key";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

export const useVehicleMutations = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
  };

  const handleError = (error: Error | PostgrestError, fallbackMessage: string) => {
    if ('code' in error && error.code === "23505") {
      toast.error("Vehicle with this number already exists");
    } else {
      toast.error(error.message || fallbackMessage);
    }
  };

  const createMutation = useMutation({
    mutationFn: async ({ vehicle, file }: { vehicle: VehicleInsert; file: File | null }) => {
      const created = await vehicleApi.create(vehicle);
      if (file) {
        const imageUrl = await vehicleApi.uploadImage(created.id, file);
        return vehicleApi.update(created.id, { image_url: imageUrl });
      }
      return created;
    },
    onSuccess: () => handleSuccess("Vehicle added successfully"),
    onError: (error) => handleError(error, "Failed to save vehicle"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates, file }: { id: string; updates: VehicleUpdate; file: File | null }) => {
      let imageUrl = updates.image_url;
      if (file) {
        imageUrl = await vehicleApi.uploadImage(id, file);
        updates.image_url = imageUrl;
      }
      return vehicleApi.update(id, updates);
    },
    onSuccess: () => handleSuccess("Vehicle updated successfully"),
    onError: (error) => handleError(error, "Failed to update vehicle"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) =>
      vehicleApi.toggleStatus(id, currentStatus),
    onSuccess: (_, variables) => {
      handleSuccess(`Vehicle marked as ${variables.currentStatus ? "unavailable" : "available"}`);
    },
    onError: (error) => handleError(error, "Failed to update vehicle status"),
  });

  return {
    createVehicle: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateVehicle: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleVehicleStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
  };
};
