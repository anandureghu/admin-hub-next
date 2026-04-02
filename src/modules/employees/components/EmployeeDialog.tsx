import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; // IMPORT SUPABASE
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    employeeFormSchema,
    type EmployeeFormValues,
    type Employee
} from "../schemas/employee.schema";
import { useEmployeeMutation } from "../hooks/useEmployeesQuery";

interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: Employee | null;
}

export function EmployeeDialog({ open, onOpenChange, employee }: EmployeeDialogProps) {
    const mutation = useEmployeeMutation();

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "EMPLOYEE",
        },
    });

    useEffect(() => {
        if (employee) {
            form.reset({
                name: employee.name,
                email: employee.email,
                phone: employee.phone ?? "",
                role: employee.role ?? "EMPLOYEE",
            });
        } else {
            form.reset({ name: "", email: "", phone: "", role: "EMPLOYEE" });
        }
    }, [employee, form, open]);

    // NEW: Helper function to check for duplicates
    async function checkDuplicates(email: string, phone: string, currentEmployeeId: string | null) {
        let query = supabase
            .from("users")
            .select("id, email, phone")
            .or(`email.eq.${email},phone.eq.${phone}`);

        if (currentEmployeeId) {
            query = query.neq("id", currentEmployeeId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error checking duplicates:", error);
            throw new Error("Failed to validate employee data.");
        }

        if (data && data.length > 0) {
            const emailConflict = data.some(u => u.email === email);
            const phoneConflict = data.some(u => u.phone === phone);

            if (emailConflict) return "An employee with this email already exists.";
            if (phoneConflict) return "An employee with this phone number already exists.";
        }

        return null; // No duplicates found
    }

    async function onSubmit(values: EmployeeFormValues) {
        try {
            // 1. Run the duplicate check first
            const duplicateError = await checkDuplicates(values.email, values.phone, employee?.id ?? null);

            if (duplicateError) {
                toast.error(duplicateError);
                return; // Stop execution
            }

            // 2. If no duplicates, proceed with mutation
            await mutation.mutateAsync({
                id: employee?.id ?? null,
                payload: values,
            });

            toast.success(employee ? "Employee updated" : "Employee created");
            onOpenChange(false);
        } catch (error) {
            // Fallback error handling
            toast.error(error.message || "Something went wrong while saving the employee.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                    <DialogDescription>
                        {employee ? "Update employee details." : "Create a new team member."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="bg-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john@company.com"
                                            className="bg-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="+49 151 23456789"
                                            className="bg-input"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormDescription className="text-[11px] text-muted-foreground/80">
                                        Formats: +49, 0049, or 0 (e.g., 0172 1234567)
                                    </FormDescription>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-input border-border">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Saving..." : employee ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}