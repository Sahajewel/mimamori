import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে")
      .max(50, "নাম ৫০ অক্ষরের বেশি হবে না"),
    email: z.email({ message: "সঠিক email দাও" }),
    password: z
      .string()
      .min(8, "password কমপক্ষে ৮ অক্ষর হতে হবে")
      .regex(/[A-Z]/, "একটা বড় হাতের অক্ষর থাকতে হবে")
      .regex(/[0-9]/, "একটা সংখ্যা থাকতে হবে"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password মিলছে না",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "সঠিক email দাও" }),
  password: z.string().min(1, "password দাও"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
