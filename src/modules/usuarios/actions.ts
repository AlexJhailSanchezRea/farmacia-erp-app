"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { usuarioSchema } from "./validations";
import { registrarUsuarioService, editarUsuarioService, cambiarEstadoUsuarioService } from "./services";

export async function guardarUsuarioAction(prevState: unknown, formData: FormData) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_usuario")) {
        return { error: "No tienes permisos para realizar esta acción." };
    }

    try {
        const id = formData.get("id") ? Number(formData.get("id")) : undefined;
        const nombre = formData.get("nombre")?.toString() || "";
        const correo = formData.get("correo")?.toString() || "";
        const contrasena = formData.get("contrasena")?.toString() || undefined;
        const rolId = formData.get("rolId")?.toString() || "";

        const validacion = usuarioSchema.safeParse({ id, nombre, correo, contrasena, rolId });
        
        if (!validacion.success) {
            return { error: validacion.error.issues[0].message };
        }

        if (id) {
            await editarUsuarioService(id, {
                nombre: validacion.data.nombre,
                correo: validacion.data.correo,
                contrasena: validacion.data.contrasena,
                rolId: validacion.data.rolId
            });
        } else {
            await registrarUsuarioService({
                nombre: validacion.data.nombre,
                correo: validacion.data.correo,
                contrasena: validacion.data.contrasena,
                rolId: validacion.data.rolId
            });
        }

        revalidatePath("/usuarios");
        return { success: true };
    } catch (error: unknown) {
        // Manejar error de correo único de Prisma
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: "El correo electrónico ya está registrado." };
        }
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al guardar el usuario." };
    }
}

export async function alternarEstadoUsuarioAction(id: number, estadoActual: "ACTIVO" | "INACTIVO") {
    try {
        await cambiarEstadoUsuarioService(id, estadoActual);
        revalidatePath("/usuarios");
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al cambiar estado." };
    }
}
