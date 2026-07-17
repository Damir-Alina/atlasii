import { z } from "zod";

const emailField = z
  .string()
  .min(1, "Введите email")
  .email("Введите корректный email");

const passwordField = z
  .string()
  .min(8, "Минимум 8 символов")
  .regex(/[A-Za-z]/, "Пароль должен содержать хотя бы одну букву")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Введите пароль"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Введите имя")
      .max(60, "Слишком длинное имя"),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Повторите пароль"),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "Нужно согласиться с условиями" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
