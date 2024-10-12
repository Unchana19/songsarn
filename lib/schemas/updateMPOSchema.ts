import { z } from "zod";

export const updateMPOSchema = z.object({
  materials: z.array(
    z.object({
      mpo_ol_id: z.string().min(1),
      material_price: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Price must be a number"),
    })
  ),
});

export type UpdateMPOSchema = z.infer<typeof updateMPOSchema>;
