import { z } from "zod";

export const setAddressPOSchema = z.object({
  phone_number: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 characters" })
    .regex(/^0[0-9]{9}$/, {
      message: "Phone number must start with 0 and contain only numbers",
    }),
  address: z.string().min(1).max(255),
  lat: z.number(),
  lng: z.number(),
  delivery_price: z.number().max(8).default(0),
});

export type setAddressPOSchema = z.infer<typeof setAddressPOSchema>;
