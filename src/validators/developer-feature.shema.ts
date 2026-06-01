import { z } from "zod";

export const createDeveloperFeatureSchema = z.object({
  developer_id: z.number(),
  feature_id: z.number(),
  value: z.string().optional(),
});

export type CreateDeveloperFeatureInput = z.infer<
  typeof createDeveloperFeatureSchema
>;
