import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  phone_number: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 characters" })
    .regex(/^0[0-9]{9}$/, {
      message: "Phone number must start with 0 and contain only numbers",
    }),
});

export type updateProfileSchema = z.infer<typeof updateProfileSchema>;
