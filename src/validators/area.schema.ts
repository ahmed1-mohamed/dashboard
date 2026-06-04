import { z } from "zod";

export const areaSchema = z.object({
  dld_area_name: z.string().min(1, "Name is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
});

export type AreaInput = z.infer<typeof areaSchema>;
