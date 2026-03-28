import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface ApiError extends Error {
    code?: string;
    status?: number;
}

export function EmployeeDialog({ open, onOpenChange, employee }: EmployeeDialogProps) {
    const mutation = useEmployeeMutation();

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    // Sync form with employee data when editing
    useEffect(() => {
        if (employee) {
            form.reset({
                name: employee.name,
                email: employee.email,
                phone: employee.phone ?? "",
            });
        } else {
            form.reset({ name: "", email: "", phone: "" });
        }
    }, [employee, form, open]);

    async function onSubmit(values: EmployeeFormValues) {
        try {
            await mutation.mutateAsync({
                id: employee?.id ?? null,
                payload: values,
            });

            toast.success(employee ? "Employee updated" : "Employee created");
            onOpenChange(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                const apiError = error as ApiError; // Narrowing the type

                if (apiError.code === "23505") {
                    toast.error("An employee with this email already exists");
                } else {
                    toast.error(apiError.message || "Something went wrong");
                }
            }
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
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="+1 234 567 8900"
                                            className="bg-input"
                                            {...field}
                                        />
                                    </FormControl>
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