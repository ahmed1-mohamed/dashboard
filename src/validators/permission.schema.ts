import { z } from "zod";

export const permissionSchema = z.object({
  permission_name: z.string().min(1, "Permission name is required"),
  description: z.string().optional(),
});

export type PermissionInput = z.infer<typeof permissionSchema>;
