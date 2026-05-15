import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "名前は2文字以上入力してください")
      .max(50, "名前は50文字以内で入力してください"),
    email: z.email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上必要です")
      .regex(/[A-Z]/, "大文字を1文字以上含めてください")
      .regex(/[0-9]/, "数字を1文字以上含めてください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
