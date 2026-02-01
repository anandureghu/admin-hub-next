import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEmployees((data as any) || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    }
  }, [sorting, pagination, columnFilters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "", email: "" });
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email || "",
      phone: employee.phone || "",
    });
    setDialogOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newEmployee.email || !newEmployee.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload: UserInsert = {
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone || null,
      role: "EMPLOYEE",
      is_active: true
    };

    try {
      const { error } = await supabase
        .from("users")
        .insert(payload);

      if (error) throw error;

      toast.success("Employee added successfully");
      setDialogOpen(false);
      setNewEmployee({ name: "", phone: "", email: "" });
      fetchEmployees();
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast.error(error.message || "Failed to add employee");
    }
  }

  async function toggleEmployeeStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("users")
        .from("users")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;


      toast.success(`Employee ${currentStatus ? "deactivated" : "activated"}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee status");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button onClick={() => handleAddEmployee()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update employee details."
                  : "Create a new employee."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emp-name">Full Name *</Label>
                <Input
                  id="emp-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-input border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-email">Email *</Label>
                <Input
                  id="emp-email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emp-phone">Phone</Label>
                <Input
                  id="emp-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-input border-border"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Employee" : "Create Employee"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        meta={{
          onToggleStatus: toggleEmployeeStatus,
          onEditEmployee: handleEditEmployee,
        }}
        toolbar={(table) => {
          return (
            <div className="flex items-center justify-between py-4 mx-1">
              <Input
                placeholder="Search"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <div className="flex items-center gap-4 mr-2">
                <div className="flex flex-row items-center gap-2">
                  <Label htmlFor="admin-switch">Active</Label>
                  <Switch
                    id="admin-switch"
                    checked={activeSwitch}
                    onCheckedChange={(checked) => {
                      setActiveSwitch(checked);
                      table
                        .getColumn("is_active")
                        .setFilterValue(checked ? true : undefined);
                    }}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label htmlFor="admin-switch">Admin</Label>
                  <Switch
                    id="admin-switch"
                    checked={adminSwitch}
                    onCheckedChange={(checked) => {
                      setAdminSwitch(checked);
                      if (checked)
                        table.getColumn("role").setFilterValue("ADMIN");
                      else table.getColumn("role").setFilterValue(undefined);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }}
        rowCount={totalCount}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
