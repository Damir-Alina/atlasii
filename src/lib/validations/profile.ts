import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(2, "Введите имя").max(60, "Слишком длинное имя"),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
