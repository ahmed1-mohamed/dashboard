import { z } from "zod";

export const propertySubtypeSchema = z.object({
  property_type_id: z.number(),
  name: z.string().min(1, "Property subtype name is required"),
  description: z.string().optional(),
  status: z.string().optional(),
});

export type PropertySubtypeInput = z.infer<typeof propertySubtypeSchema>;
