import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  Table as TableType,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  meta?: unknown;
  toolbar?: (table: TableType<TData>) => ReactNode;
  rowCount: number;
  pagination: PaginationState;
  setPagination: (updater: PaginationState) => void;
  sorting: SortingState;
  setSorting: (updater: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: ColumnFiltersState) => void;
  isLoading?: boolean;
  tableContainerClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  meta,
  toolbar,
  pagination,
  sorting,
  columnFilters,
  setPagination,
  setSorting,
  setColumnFilters,
  rowCount,
  isLoading,
  tableContainerClassName,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    meta,
  });

  return (
    // The outer container stays flex-1 so the entire block can fill the page if needed
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden space-y-4">
      {toolbar?.(table)}

      {/* THE FIX: Replaced 'flex-1' with 'shrink' in the wrapperClassName */}
      <Table wrapperClassName={`rounded-md border pr-1 shrink min-h-0 overflow-y-auto custom-scrollbar pb-2 ${tableContainerClassName || ""}`}>
        <TableHeader className="sticky top-0 z-10 bg-background outline outline-1 outline-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="mt-4 py-3 px-4 rounded-md border border-border bg-secondary/20 flex items-center justify-end shadow-sm">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}