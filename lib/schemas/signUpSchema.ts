import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email(),
    phoneNumber: z
      .string()
      .length(10, { message: "Phone number must be exactly 10 characters" })
      .regex(/^0[0-9]{9}$/, {
        message: "Phone number must start with 0 and contain only numbers",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
