import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  useEmployeesQuery,
  useToggleEmployeeStatusMutation,
} from "../hooks/useEmployeesQuery";
import { EmployeeDialog } from "./EmployeeDialog";
import { Employee } from "../schemas/employee.schema";
import { columns } from "../columns/employeeColumns";
import { useNavigate } from "react-router-dom";
import { DebouncedInput } from "@/components/ui/debounced-input";

export default function Employees() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useEmployeesQuery(
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters
  );

  const toggleStatusMutation = useToggleEmployeeStatusMutation();

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const handleToggleStatus = (id: string, status: boolean) => {
    toggleStatusMutation.mutate({ id, currentStatus: status });
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button
          onClick={() => {
            setEditingEmployee(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={(data?.data ?? []) as Employee[]}
        onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
        isLoading={isLoading}
        rowCount={data?.count ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        meta={{
          onToggleStatus: handleToggleStatus,
          onEditEmployee: handleEdit,
        }}
        toolbar={(table) => (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 gap-4 px-1">
            <DebouncedInput
              placeholder="Search names or phone numbers..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(value) =>
                table.getColumn("name")?.setFilterValue(value)
              }
              className="max-w-sm bg-input border-border"
              debounce={500} // Optional: adjust the delay here!
            />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="active-filter" className="text-sm font-medium">
                  Active Only
                </Label>
                <Switch
                  id="active-filter"
                  checked={
                    (table.getColumn("is_active")?.getFilterValue() as boolean) ?? false
                  }
                  onCheckedChange={(checked) => {
                    table.getColumn("is_active")?.setFilterValue(checked ? true : undefined);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="admin-filter" className="text-sm font-medium">
                  Admins
                </Label>
                <Switch
                  id="admin-filter"
                  checked={table.getColumn("role")?.getFilterValue() === "ADMIN"}
                  onCheckedChange={(checked) => {
                    table.getColumn("role")?.setFilterValue(checked ? "ADMIN" : undefined);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      />

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee}
      />
    </div>
  );
}