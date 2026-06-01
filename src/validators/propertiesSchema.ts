import { z } from "zod";

export const propertiesSchema = z.object({
  property_name: z.string().min(1, "Property Name is required"),
  status: z.string().min(1, "Status is required"),
  plot_size: z.number().min(0, "Plot Size must be positive").optional(),
  bua_size: z.number().min(0, "BUA Size must be positive").optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  size: z.number().min(0, "Size must be positive").optional(),
  bedrooms: z
    .number()
    .int()
    .min(0, "Bedrooms must be a positive integer")
    .optional(),
  bathrooms: z
    .number()
    .int()
    .min(0, "Bathrooms must be a positive integer")
    .optional(),
  parking_spaces: z
    .number()
    .int()
    .min(0, "Parking Spaces must be a positive integer")
    .optional(),
  reference_listed: z.string().optional(),
  broker_license: z.string().optional(),
  agent_license: z.string().optional(),
  zone_name: z.string().optional(),
  dld_permit_number: z.string().optional(),
  dld_barcode: z.string().optional(),
  availability_status: z.string().optional(),
  construction_status: z.string().optional(),
  furnish_status: z.string().optional(),
  finishing_status: z.string().optional(),
  ownership_type: z.string().optional(),
  maid_room: z.boolean().optional(),
  property_type_id: z.string(),
  property_subtype_id: z.string(),
  project_id: z.string(),
  building_name: z.string().min(1, "Building Name is required"),
  description: z.string().optional(),
  // Add other fields as necessary based on the UI but keeping them optional if not strictly required
  currency: z.string().optional(),
  total_price: z.number().optional(),
  price_per_m2: z.number().optional(),
  price_description: z.string().optional(),
  unit_number: z.string().optional(),
  view: z.string().optional(),
  floor: z.string().optional(),
});

export type PropertiesInput = z.infer<typeof propertiesSchema>;
