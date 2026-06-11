import { obtenerRegistrosAuditoria, registrarAuditoriaEnBD } from "./repository";
import { AuditoriaRegistro, CrearAuditoriaData } from "./types";

export async function servicioObtenerAuditoria(limite?: number): Promise<AuditoriaRegistro[]> {
    return obtenerRegistrosAuditoria(limite);
}

export async function servicioRegistrarAuditoria(
    data: CrearAuditoriaData, 
    contexto: { usuarioId: number | null; usuarioCorreo: string | null; ip: string | null; userAgent: string | null }
): Promise<void> {
    try {
        await registrarAuditoriaEnBD({
            usuarioId: contexto.usuarioId,
            usuarioCorreo: contexto.usuarioCorreo,
            modulo: data.modulo,
            accion: data.accion,
            descripcion: data.descripcion,
            entidadId: data.entidadId ?? null,
            entidad: data.entidad ?? null,
            ip: contexto.ip,
            userAgent: contexto.userAgent
        });
    } catch (error) {
        console.error("Fallo al registrar auditoría (silencioso):", error);
    }
}
