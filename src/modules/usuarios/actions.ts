"use server";
import { obtenerUsuarioAutenticado, hashearToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { usuarioSchema } from "./validations";
import { registrarUsuarioService, editarUsuarioService, cambiarEstadoUsuarioService, servicioCambiarContrasena, servicioResetearContrasena } from "./services";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

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
            await accionRegistrarAuditoria({
                modulo: "Usuarios",
                accion: "Editar",
                descripcion: `Usuario editado: ${validacion.data.correo}`,
                entidadId: id,
                entidad: "Usuario"
            });
        } else {
            const nuevo = await registrarUsuarioService({
                nombre: validacion.data.nombre,
                correo: validacion.data.correo,
                contrasena: validacion.data.contrasena,
                rolId: validacion.data.rolId
            });
            await accionRegistrarAuditoria({
                modulo: "Usuarios",
                accion: "Crear",
                descripcion: `Usuario creado: ${validacion.data.correo}`,
                entidadId: nuevo.id,
                entidad: "Usuario"
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

export async function cambiarContrasenaAccion(prevState: unknown, formData: FormData) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario) {
        return { error: "No autenticado." };
    }

    const actual = formData.get("actual")?.toString() || "";
    const nueva = formData.get("nueva")?.toString() || "";
    const confirmar = formData.get("confirmar")?.toString() || "";

    if (!actual || !nueva || !confirmar) {
        return { error: "Todos los campos son obligatorios." };
    }

    if (nueva.length < 8) {
        return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
    }

    if (nueva !== confirmar) {
        return { error: "Las contraseñas no coinciden." };
    }

    try {
        const cookieStore = await cookies();
        const sessionCruda = cookieStore.get("nexa_session")?.value;
        if (!sessionCruda) throw new Error("No hay sesión válida.");

        const sessionHash = hashearToken(sessionCruda);

        await servicioCambiarContrasena(
            usuario.id,
            usuario.correo,
            actual,
            nueva,
            sessionHash
        );
        return { success: true, mensaje: "Contraseña cambiada exitosamente." };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al cambiar la contraseña." };
    }
}

export async function resetearContrasenaAccion(prevState: unknown, formData: FormData) {
    const admin = await obtenerUsuarioAutenticado();
    if (!admin || admin.rol.nombre !== "Administrador") {
        return { error: "No tienes permisos para resetear contraseñas." };
    }

    const usuarioId = Number(formData.get("usuarioId"));
    const nueva = formData.get("nueva")?.toString() || "";
    const confirmar = formData.get("confirmar")?.toString() || "";

    if (!usuarioId || !nueva || !confirmar) {
        return { error: "Todos los campos son obligatorios." };
    }

    if (nueva.length < 8) {
        return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
    }

    if (nueva !== confirmar) {
        return { error: "Las contraseñas no coinciden." };
    }

    try {
        await servicioResetearContrasena(
            admin.id,
            admin.correo,
            usuarioId,
            nueva
        );
        revalidatePath("/usuarios");
        return { success: true, mensaje: "Contraseña reseteada exitosamente." };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al resetear la contraseña." };
    }
}
