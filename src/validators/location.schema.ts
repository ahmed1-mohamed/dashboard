import { z } from "zod";

export const locationSchema = z.object({
  location_name_en: z.string().min(1, "English name is required"),
  location_name_ar: z.string().min(1, "Arabic name is required"),
  google_map_link: z.string().url("Invalid URL").optional().or(z.literal("")),
  north_side: z.string().optional(),
  south_side: z.string().optional(),
  east_side: z.string().optional(),
  west_side: z.string().optional(),
  landmark: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  area_id: z.number().optional(),
  city_id: z.number().optional(),
  region_id: z.number().optional(),
  country_id: z.number().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;

export const editLocationSchema = z.object({
  location_name_ar: z.string().min(1, "Arabic name is required"),
  location_name_en: z.string().min(1, "English name is required"),
  is_active: z.boolean().optional(),
});

export type EditLocationInput = z.infer<typeof editLocationSchema>;
