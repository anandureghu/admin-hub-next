import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

export const employeeKeys = {
  all: ["employees"] as const,
  list: (page: number, sorting: SortingState, filters: ColumnFiltersState) =>
    [...employeeKeys.all, "list", { page, sorting, filters }] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};
