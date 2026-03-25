import * as z from "zod";

export const workSessionSchema = z.object({
  id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string().nullable(),
  notes: z.string().nullable(),
  location: z.any().nullable(),
  created_at: z.string(),
});

export type WorkSession = z.infer<typeof workSessionSchema>;