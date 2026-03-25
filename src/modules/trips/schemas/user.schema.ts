import * as z from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  is_active: z.boolean().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
