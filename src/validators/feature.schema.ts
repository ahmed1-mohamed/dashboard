import { z } from "zod";

export const featureSchema = z.object({
  feature_name: z.string().min(1, "Feature name is required"),
  is_amenity: z.number().min(0).max(1).optional(),
  icons: z.string().optional(),
});

export type FeatureInput = z.infer<typeof featureSchema>;
