import { z } from "zod";

export const usuarioSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    correo: z.string().email("Debe ser un correo válido"),
    contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
    rolId: z.coerce.number().min(1, "Debe seleccionar un rol")
});

export type UsuarioFormValues = z.infer<typeof usuarioSchema>;
