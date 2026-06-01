import { z } from "zod";

export const rolesSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  role_type: z.string().min(1, "Role type is required"),
  description: z.string().min(1, "Description is required"),
});

export type RolesFormInput = z.infer<typeof rolesSchema>;
