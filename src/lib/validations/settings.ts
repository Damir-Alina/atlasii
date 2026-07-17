import { z } from "zod";

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[A-Za-z]/, "Пароль должен содержать хотя бы одну букву")
      .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру"),
    confirmPassword: z.string().min(1, "Повторите пароль"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
