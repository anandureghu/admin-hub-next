import * as z from "zod";

export const appConfigSchema = z.object({
  id: z.string().uuid(),
  latest_version: z.string(),
  min_supported_version: z.string(),
  update_mode: z.enum(["NONE", "WARNING", "FORCE"]),
  warning_message: z.string().nullable(),
  force_message: z.string().nullable(),
  apk_url: z.string().nullable(),
  maintenance_mode: z.boolean().nullable(),
  maintenance_message: z.string().nullable(),
  is_active: z.boolean().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const appConfigFormSchema = z.object({
  id: z.string().optional(),
  latest_version: z.string().min(1, "Latest version is required"),
  min_supported_version: z.string().min(1, "Minimum supported version is required"),
  update_mode: z.enum(["NONE", "WARNING", "FORCE"]).default("NONE"),
  warning_message: z.string().nullable(),
  force_message: z.string().nullable(),
  apk_url: z.string().url("Must be a valid URL").nullable().or(z.literal('')),
  maintenance_mode: z.boolean().default(false),
  maintenance_message: z.string().nullable(),
  is_active: z.boolean().default(true),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
export type AppConfigFormValues = z.infer<typeof appConfigFormSchema>;
