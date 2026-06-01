import { z } from "zod";

export const propertySchema = z.object({
  property_name: z.string().min(1, "Property name is required"),
  property_type_id: z.number(),
  property_subtype_id: z.number().optional(),
  project_id: z.number().optional(),
  building_id: z.number().optional(),
  plot_size: z.string().optional(),
  bua_size: z.string().optional(),
  maid_room: z.number().optional(),
  status: z.string(),
  furnish_status: z.string().optional(),
  finishing_status: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  size: z.string().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parking_spaces: z.number().min(0).optional(),
  availability_status: z.string(),
  construction_status: z.string().optional(),
  description: z.string().optional(),
  reference_listed: z.string().optional(),
  ownership_type: z.string().optional(),
  broker_license: z.string().optional(),
  agent_license: z.string().optional(),
  zone_name: z.string().optional(),
  dld_permit_number: z.string().optional(),
  dld_barcode: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
