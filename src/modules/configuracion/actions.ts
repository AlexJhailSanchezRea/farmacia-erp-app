"use server";

import { servicioObtenerConfiguracion, servicioActualizarConfiguracion } from "./services";
import { ConfiguracionSistema, ConfiguracionUpdateData } from "./types";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function accionObtenerConfiguracion(): Promise<ConfiguracionSistema> {
    return servicioObtenerConfiguracion();
}

export async function accionActualizarConfiguracion(data: ConfiguracionUpdateData): Promise<{ success: boolean; data?: ConfiguracionSistema; error?: string }> {
    try {
        const usuario = await obtenerUsuarioAutenticado();
        
        if (!usuario || usuario.rol.nombre !== "Administrador") {
            return { success: false, error: "No autorizado para modificar la configuración." };
        }

        const conf = await servicioActualizarConfiguracion(data);
        
        await accionRegistrarAuditoria({
            modulo: "Configuracion",
            accion: "Actualizar",
            descripcion: `Configuración actualizada (${data.nombreComercial})`,
            entidadId: conf.id,
            entidad: "Configuracion"
        });

        return { success: true, data: conf };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message || "Error al actualizar la configuración." };
        }
        return { success: false, error: "Error al actualizar la configuración." };
    }
}
