import { Employee } from "@/modules/employees/schemas/employee.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../../src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../src/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../src/components/ui/avatar";
import { StatusBadge } from "../../../../src/components/ui/status-badge";
import { SortableHeader } from "../../../../src/components/ui/sortable-header";

interface MetaTypes {
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
  onEditEmployee: (employee: Employee) => void;
}


const getInitials = (name: string) => {
  if (!name) return ""; // Safety check for empty names

  return name
    .trim() // Remove leading/trailing spaces
    .split(/\s+/) // Split by one or more spaces safely
    .slice(0, 2) // Take only the first two words
    .map((part) => part[0]) // Get the first letter of each word
    .join("") // Join them back together
    .toUpperCase(); // Ensure uppercase
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex ml-6">
          <SortableHeader column={column} title={"Name"} />
        </div>
      );
    },
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={employee.avatar_url} alt={`${employee.name}'s avatar`} />
            {/* UPDATE: Fallback now displays dynamic initials and a new style */}
            <AvatarFallback className="flex items-center justify-center font-bold text-lg bg-gray-200 text-gray-800 rounded-full w-full h-full">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <span>{employee.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <StatusBadge status={employee.is_active ? "active" : "inactive"} />
      );
    },
  },
  {
    accessorKey: "created_at",
    accessorFn: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
    header: "Joined"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const employee = row.original;
      const actions = table.options.meta as MetaTypes;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => { e.stopPropagation() }}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e?.preventDefault?.();
                e?.stopPropagation?.();
                actions.onToggleStatus(employee.id, employee.is_active);
              }}
            >
              {employee.is_active ? "Set as Inactive" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e?.preventDefault?.();
                e?.stopPropagation?.();
                actions.onEditEmployee(employee);
              }}
            >
              Edit Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];