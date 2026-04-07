import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
    const { t } = useTranslation();
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
        if (employee && open) {
            form.reset({
                name: employee.name,
                email: employee.email,
                phone: employee.phone ?? "",
                role: employee.role ?? "EMPLOYEE",
            });
        } else if (open) {
            form.reset({ name: "", email: "", phone: "", role: "EMPLOYEE" });
        }
    }, [employee, form, open]);

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
            throw new Error(t("employees.dialog.errorValidation"));
        }

        if (data && data.length > 0) {
            const emailConflict = data.some(u => u.email === email);
            const phoneConflict = data.some(u => u.phone === phone);

            if (emailConflict) return t("employees.dialog.errorDuplicateEmail");
            if (phoneConflict) return t("employees.dialog.errorDuplicatePhone");
        }

        return null;
    }

    async function onSubmit(values: EmployeeFormValues) {
        try {
            const duplicateError = await checkDuplicates(values.email, values.phone, employee?.id ?? null);

            if (duplicateError) {
                toast.error(duplicateError);
                return;
            }

            await mutation.mutateAsync({
                id: employee?.id ?? null,
                payload: values,
            });

            toast.success(employee ? t("employees.dialog.successUpdate") : t("employees.dialog.successCreate"));
            onOpenChange(false);
        } catch (error) {
            toast.error(error.message || t("employees.dialog.errorGeneric"));
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {employee ? t("employees.dialog.titleEdit") : t("employees.dialog.titleAdd")}
                    </DialogTitle>
                    <DialogDescription>
                        {employee ? t("employees.dialog.descriptionEdit") : t("employees.dialog.descriptionAdd")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("employees.dialog.nameLabel")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("employees.dialog.namePlaceholder")} className="bg-input" {...field} />
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
                                    <FormLabel>{t("employees.dialog.emailLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={t("employees.dialog.emailPlaceholder")}
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
                                    <FormLabel>{t("employees.dialog.phoneLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder={t("employees.dialog.phonePlaceholder")}
                                            className="bg-input"
                                            {...field}
                                            onChange={(e) => {
                                                const cleanedValue = e.target.value.replace(/[^\d+\s]/g, "");
                                                field.onChange(cleanedValue);
                                            }}
                                        />
                                    </FormControl>

                                    <FormDescription className="text-[11px] text-muted-foreground/80">
                                        {t("employees.dialog.phoneDescription")}
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
                                    <FormLabel>{t("employees.dialog.roleLabel")}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-input border-border">
                                                <SelectValue placeholder={t("employees.dialog.rolePlaceholder")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-card border-border">
                                            <SelectItem value="EMPLOYEE">{t("employees.dialog.roleEmployee")}</SelectItem>
                                            <SelectItem value="ADMIN">{t("employees.dialog.roleAdmin")}</SelectItem>
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
                                {t("employees.dialog.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending 
                                    ? t("employees.dialog.saving") 
                                    : (employee ? t("employees.dialog.update") : t("employees.dialog.create"))
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}