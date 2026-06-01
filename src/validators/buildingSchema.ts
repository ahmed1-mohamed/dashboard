import { z } from "zod";

export const buildingSchema = z.object({
  building_name: z.string().min(1, "Building name is required"),
  total_floors: z.number().min(1, "Must have at least 1 floor"),
  total_units: z.number().min(0, "Total units cannot be negative"),
  construction_status: z.string(),
  completion_date: z.string(),
  description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  building_type: z.string(),
  built_type: z.string(),
  parking_spaces: z.number().min(0).optional(),
  location_id: z.number().optional(),
  project_id: z.number().optional(),
});

export type BuildingInputType = z.infer<typeof buildingSchema>;
