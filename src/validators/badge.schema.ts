import { z } from "zod";

export const badgeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  applies_to: z.enum(["developer", "property", "agent"]),
  monthly_price_credits: z
    .number()
    .min(0, "Monthly price credits must be at least 0"),
  max_entities: z.number().min(1, "Max entities must be at least 1"),
});

export type BadgeInput = z.infer<typeof badgeSchema>;
