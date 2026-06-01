import { z } from "zod";

export const addressSchema = z.object({
  entity_id: z.number(),
  entity_type: z.string(),
  address_line_1: z.string().min(1, "Address line 1 is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  is_primary: z.number().optional(),
  phone_number: z.union([z.string(), z.number()]).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
