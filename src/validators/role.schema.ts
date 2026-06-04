import { z } from "zod";

const permissionActionsSchema = z.object({
  view: z.boolean().optional(),
  create: z.boolean().optional(),
  edit: z.boolean().optional(),
  delete: z.boolean().optional(),
});

export const rolesSchema = z.object({
  role_name: z.string().min(1, "Role name is required").max(50, "Role name must not be greater than 50 characters"),
  role_type: z.enum(["user", "admin", "developer", "agent", "consultant"], {
    message: "Please select a valid role type",
  }),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  permissions: z.record(z.string(), permissionActionsSchema).optional(),
});

export type RolesFormInput = z.infer<typeof rolesSchema>;