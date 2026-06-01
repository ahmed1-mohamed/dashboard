import { z } from "zod";

export const createPropertyMediaSchema = z.object({
  property_id: z.number().optional(),
  media_type: z.string(),
  media_url: z.any().optional(),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  my_order: z.boolean().optional(),
});

export type CreatePropertyMediaInput = z.infer<
  typeof createPropertyMediaSchema
>;
