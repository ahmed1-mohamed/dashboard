import { z } from "zod";

export const createProjectFeatureSchema = z.object({
  project_id: z.number(),
  feature_id: z.number(),
  value: z.string().optional(),
  description: z.string().optional(),
});

export type CreateProjectFeatureInput = z.infer<
  typeof createProjectFeatureSchema
>;

export const editProjectFeatureSchema = z.object({
  value: z.string().optional(),
  description: z.string().optional(),
});

export type EditProjectFeatureInput = z.infer<typeof editProjectFeatureSchema>;
