import { z } from "zod";

export const createProductSchema = z.object({
  category: z.string(),
  name: z.string().min(1).max(20),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Quantity must be a number"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
