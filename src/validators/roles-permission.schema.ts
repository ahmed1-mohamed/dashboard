import { z } from "zod";

export const createRolesPermissionsSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
});

export type CreateRolesPermissionsInput = z.infer<
  typeof createRolesPermissionsSchema
>;
