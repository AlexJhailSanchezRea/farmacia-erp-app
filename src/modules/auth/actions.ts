"use server";

import { loginSchema } from "./validations";
import { iniciarSesionService, cerrarSesionService } from "./services";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
    try {
        const correo = formData.get("correo")?.toString() || "";
        const contrasena = formData.get("contrasena")?.toString() || "";

        // Validar schema
        const validacion = loginSchema.safeParse({ correo, contrasena });
        
        if (!validacion.success) {
            return { error: validacion.error.issues[0].message };
        }

        // Ejecutar servicio
        await iniciarSesionService(validacion.data.correo, validacion.data.contrasena);

        // Si todo sale bien
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al iniciar sesión." };
    }
}

export async function logoutAction() {
    await cerrarSesionService();
    redirect("/login");
}
