import { z } from "zod";

export const mediaSchema = z.object({
  entity_type: z.string(),
  entity_id: z.number(),
  media_type: z.string(),
  media_url: z.any().optional(),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  my_order: z.boolean().optional(),
});

export type MediaInput = z.infer<typeof mediaSchema>;
