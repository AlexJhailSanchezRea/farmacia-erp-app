"use server";

import { headers } from "next/headers";
import { servicioObtenerAuditoria, servicioRegistrarAuditoria } from "./services";
import { AuditoriaRegistro, CrearAuditoriaData } from "./types";
import { obtenerUsuarioAutenticado } from "@/lib/auth";

export async function accionObtenerAuditoria(): Promise<AuditoriaRegistro[]> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || usuario.rol.nombre !== "Administrador") {
        return [];
    }
    return servicioObtenerAuditoria();
}

/**
 * Registra una acción de auditoría de forma asíncrona ("fire and forget").
 * Utiliza headers de next para intentar capturar IP y User-Agent.
 */
export async function accionRegistrarAuditoria(data: CrearAuditoriaData): Promise<void> {
    try {
        const usuario = await obtenerUsuarioAutenticado();
        
        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || null;
        const userAgent = reqHeaders.get("user-agent") || null;

        await servicioRegistrarAuditoria(data, {
            usuarioId: usuario ? usuario.id : null,
            usuarioCorreo: usuario ? usuario.correo : null,
            ip,
            userAgent
        });
    } catch {
        // Ignoramos errores de auditoría para no afectar el flujo principal
    }
}
