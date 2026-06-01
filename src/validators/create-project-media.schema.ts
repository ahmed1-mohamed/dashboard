import { z } from "zod";

export const createProjectMediaSchema = z.object({
  project_id: z.number().optional(),
  media_type: z.string(),
  media_url: z.any().optional(),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  my_order: z.boolean().optional(),
});

export type CreateProjectMediaInput = z.infer<typeof createProjectMediaSchema>;
