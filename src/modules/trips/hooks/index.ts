import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

// use trip queries
export const useTripsQuery = () => {
  //   const { data: user } = useCurrentUserQuery();

  return useQuery<Trip[]>({
    queryKey: tripKeys.get(),
    queryFn: () => tripApi.get(),
    // enabled: !!user,
  });
};

export const useTripQuery = (id: string) =>
  useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripApi.getById(id),
    enabled: !!id,
  });

// trip mutations
export const useCreateTripMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Omit<Trip, "id" | "created_at" | "updated_at" | "user_id">,
    ) => tripApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tripKeys.all });
    },
    onError: (e) => toast.error("Failed to create trip. Please try again"),
  });
};

export const useUpdateTripMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Trip, "id" | "created_at" | "updated_at">>;
    }) => tripApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tripKeys.all });
    },
    onError: (e) => toast.error("Failed to update trip. Please try again"),
  });
};

// form hooks
export const useTripCreateForm = (defaultValues?: Partial<TripCreate>) =>
  useForm({
    resolver: zodResolver(tripCreateSchema),
    defaultValues: defaultValues as TripCreate,
  });

export const useTripUpdateForm = (defaultValues?: Partial<TripUpdate>) =>
  useForm({
    resolver: zodResolver(tripUpdateSchema),
    defaultValues: defaultValues as TripUpdate,
  });
