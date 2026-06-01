import { z } from "zod";

export const createPropertyFeatureSchema = z.object({
  property_id: z.number(),
  feature_id: z.number(),
  value: z.string().optional(),
});

export type CreatePropertyFeatureInput = z.infer<
  typeof createPropertyFeatureSchema
>;
