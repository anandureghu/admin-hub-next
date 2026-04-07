import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  useEmployeesQuery,
  useResetDeviceMutation,
  useToggleEmployeeStatusMutation,
} from "../hooks/useEmployeesQuery";
import { EmployeeDialog } from "./EmployeeDialog";
import { Employee } from "../schemas/employee.schema";
import { columns } from "../columns/employeeColumns";
import { useNavigate } from "react-router-dom";
import { DebouncedInput } from "@/components/ui/debounced-input";

export default function Employees() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [prevFilters, setPrevFilters] = useState<ColumnFiltersState>([]);

  const toggleStatusMutation = useToggleEmployeeStatusMutation();
  const resetDeviceMutation = useResetDeviceMutation();

  const [resetDeviceId, setResetDeviceId] = useState<string | null>(null);

  // Reset to first page when filters change
  if (JSON.stringify(prevFilters) !== JSON.stringify(columnFilters)) {
    setPrevFilters(columnFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const { data, isLoading } = useEmployeesQuery(
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters
  );

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const handleToggleStatus = (id: string, status: boolean) => {
    toggleStatusMutation.mutate({ id, currentStatus: status });
  };

  const handleResetDevice = (id: string) => {
    setResetDeviceId(id);
  };

  const confirmResetDevice = () => {
    if (resetDeviceId) {
      resetDeviceMutation.mutate(resetDeviceId);
    }
    setResetDeviceId(null);
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="page-header">{t("employees.title")}</h1>
          <p className="text-muted-foreground">{t("employees.subtitle")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingEmployee(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("employees.addEmployee")}
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
          onResetDevice: handleResetDevice,
        }}
        toolbar={(table) => (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 gap-4 px-1">
            <DebouncedInput
              placeholder={t("employees.searchPlaceholder")}
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(value) =>
                table.getColumn("name")?.setFilterValue(value)
              }
              className="max-w-sm bg-input border-border"
              debounce={500}
            />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="active-filter" className="text-sm font-medium">
                  {t("employees.activeOnly")}
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
                  {t("employees.admins")}
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

      <AlertDialog
        open={!!resetDeviceId}
        onOpenChange={(open) => !open && setResetDeviceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("employees.resetDevice.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("employees.resetDevice.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("employees.resetDevice.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetDevice}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {t("employees.resetDevice.action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}