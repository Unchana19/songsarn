import { z } from "zod";

export const createMaterialSchema = z.object({
  name: z.string().min(1).max(20),
  unit: z.string().min(1).max(20),
  quantity: z.string().regex(/^\d+(\.\d+)?$/, "Quantity must be a number"),
  threshold: z.string().regex(/^\d+(\.\d+)?$/, "Threshold must be a number"),
});

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;
