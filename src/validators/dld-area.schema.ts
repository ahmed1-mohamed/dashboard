import { z } from "zod";

export const dldAreaSchema = z.object({
  dld_area_name: z.string().min(1, "DLD area name is required"),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type DldAreaInput = z.infer<typeof dldAreaSchema>;
