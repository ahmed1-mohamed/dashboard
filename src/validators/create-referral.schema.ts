import { z } from "zod";

export const createReferralSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile number is required"),
  referral_code: z.string().optional(),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
