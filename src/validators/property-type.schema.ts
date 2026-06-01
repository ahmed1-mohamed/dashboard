import { z } from "zod";

export const propertyTypeSchema = z.object({
  name: z.string().min(1, "Property type name is required"),
  description: z.string().optional(),
  status: z.string().optional(),
});

export type PropertyTypeInput = z.infer<typeof propertyTypeSchema>;
