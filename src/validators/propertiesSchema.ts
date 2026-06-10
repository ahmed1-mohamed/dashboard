import { z } from "zod";

export const propertiesSchema = z.object({
  property_name: z.string().min(1, "Property Name is required"),
  status: z.string().min(1, "Status is required"),
  plot_size: z.number().min(0, "Plot Size must be positive").optional(),
  bua_size: z.number().min(0, "BUA Size must be positive").optional(),
  price: z
    .number({ required_error: "Price is required" })
    .min(1, "Price must be greater than 0"),
  size: z
    .number({ required_error: "Unit size is required" })
    .min(1, "Unit size must be greater than 0"),
  bedrooms: z
    .number({ required_error: "Number of bedrooms is required" })
    .int()
    .min(0, "Bedrooms must be a positive integer"),
  bathrooms: z
    .number({ required_error: "Number of bathrooms is required" })
    .int()
    .min(0, "Bathrooms must be a positive integer"),
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
  availability_status: z.string().min(1, "Availability Status is required"),
  construction_status: z.string().min(1, "Construction Status is required"),
  furnish_status: z.string().optional(),
  finishing_status: z.string().optional(),
  ownership_type: z.string().optional(),
  maid_room: z.boolean().optional(),
  property_type_id: z.string().min(1, "Property Type is required"),
  property_subtype_id: z.string().min(1, "Unit Sub Type is required"),
  project_id: z.string().min(1, "Project is required"),
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
