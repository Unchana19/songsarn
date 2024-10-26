import { z } from "zod";

export const createComponentSchema = z.object({
  category: z.string(),
  name: z.string().min(1).max(20),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Quantity must be a number"),
  color_primary_use: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Color primary use must be a number"),
  color_pattern_use: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Color pattern use must be a number"),
});

export type CreateComponentSchema = z.infer<typeof createComponentSchema>;
