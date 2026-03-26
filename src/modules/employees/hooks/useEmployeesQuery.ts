import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api/employee.api";
import { employeeKeys } from "../constants/employee.key";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { Employee, EmployeeDetail, EmployeeResponse } from "../schemas/employee.schema";

export const useEmployeesQuery = (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState,
  filters: ColumnFiltersState
) => {
  return useQuery<EmployeeResponse>({
    queryKey: employeeKeys.list(pageIndex, sorting, filters),
    queryFn: () => employeeApi.get(pageIndex, pageSize, sorting, filters),
  });
};

export const useEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: Employee }) =>
      employeeApi.upsert(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
};

export const useToggleEmployeeStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) =>
      employeeApi.toggleStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
    onError: () => {},
  });
};

export const useEmployeeQuery = (id: string | undefined) => {
  return useQuery<EmployeeDetail, Error>({
    queryKey: employeeKeys.detail(id!),
    queryFn: () => employeeApi.getById(id!),
    enabled: !!id,
  });
};

export const useEmployeeActivityQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: [...employeeKeys.detail(userId!), "activity"],
    queryFn: () => employeeApi.getEmployeeActivity(userId!),
    enabled: !!userId,
  });
};