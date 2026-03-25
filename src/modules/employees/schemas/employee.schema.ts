import * as z from "zod";

export const employeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  is_active: z.boolean(),
  company_id: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const employeeResponseSchema = z.object({
  data: z.array(employeeSchema),
  count: z.number(),
});

export const employeeFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeResponse = z.infer<typeof employeeResponseSchema>;
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;