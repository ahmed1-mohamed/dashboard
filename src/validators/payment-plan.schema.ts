import { z } from "zod";

export const paymentPlanItemSchema = z.object({
  type: z.string(),
  percentage: z.number().min(0).max(100),
  intervals: z.number().optional(),
});

export const paymentPlanSchema = z.object({
  name: z.string().min(1, "Payment plan name is required"),
  description: z.string().optional(),
  total_cost: z.number().min(0),
  period_by_years: z.number().min(0),
  status: z.string().optional(),
  paymentplanitems: z.array(paymentPlanItemSchema).optional(),
});

export type PaymentPlanInput = z.infer<typeof paymentPlanSchema>;
export type PaymentPlanItemInput = z.infer<typeof paymentPlanItemSchema>;
