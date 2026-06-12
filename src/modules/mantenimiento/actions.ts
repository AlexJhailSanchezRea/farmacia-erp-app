"use server";

import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function auditarIntentoBackupAccion() {
    const usuario = await obtenerUsuarioAutenticado();
    
    // Solo administrador
    if (!usuario || usuario.rol.nombre !== "Administrador") {
        return { error: "No autorizado." };
    }

    try {
        await accionRegistrarAuditoria({
            modulo: "Mantenimiento",
            accion: "Visualizar Backup",
            descripcion: `El administrador consultó las opciones de backup de base de datos.`,
            entidadId: null,
            entidad: "Sistema"
        });

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al auditar" };
    }
}
