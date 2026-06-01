import { z } from "zod";

export const areaSchema = z.object({
  area_name: z.string().min(1, "Area name is required"),
  region: z.string().min(1, "Region is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  population: z.number().optional(),
  dld_area_id: z.number().optional(),
  major_landmarks: z.array(z.string()).optional(),
});

export type AreaInput = z.infer<typeof areaSchema>;
