import { z } from "zod";

export const createMPOSchema = z.object({
  supplier: z.string().min(1).max(20),
});

export type CreateMPOSchema = z.infer<typeof createMPOSchema>;
