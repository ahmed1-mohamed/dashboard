import { z } from "zod";

export const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  state_id: z.number(),
  country_id: z.number(),
});

export type CityInput = z.infer<typeof citySchema>;
