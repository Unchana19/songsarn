import { z } from "zod";

export const createCategorySchema = z.object({
  type: z.string(),
  name: z.string().min(1).max(20),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
