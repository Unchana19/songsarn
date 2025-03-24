import { z } from "zod";

export const createRequisitionSchema = z.object({
  quantity: z
    .string()
    .max(8)
    .regex(/^\d+(\.\d+)?$/, "Quantity must be a number"),
});

export type CreateRequisitionSchema = z.infer<typeof createRequisitionSchema>;
