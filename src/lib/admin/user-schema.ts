import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  email: z.string().email("Informe um e-mail válido."),
  role: z.enum(["admin", "editor"]),
  status: z.enum(["active", "inactive"]).default("active"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Informe o nome."),
  email: z.string().email("Informe um e-mail válido."),
  role: z.enum(["admin", "editor"]),
  status: z.enum(["active", "inactive"]),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
