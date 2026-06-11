import { z } from "zod";

export const loginSchema = z.object({
    correo: z.string().email("Correo inválido"),
    contrasena: z.string().min(1, "La contraseña es requerida")
});

export type LoginFormValues = z.infer<typeof loginSchema>;
