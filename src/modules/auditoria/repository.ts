import { prisma } from "@/lib/prisma";
import { AuditoriaRegistro } from "./types";
import { Auditoria } from "@/generated/prisma/client";

function mapearAuditoria(a: Auditoria): AuditoriaRegistro {
    return {
        id: a.id,
        usuarioId: a.usuarioId,
        usuarioCorreo: a.usuarioCorreo,
        modulo: a.modulo,
        accion: a.accion,
        descripcion: a.descripcion,
        entidadId: a.entidadId,
        entidad: a.entidad,
        ip: a.ip,
        userAgent: a.userAgent,
        creadoEn: a.creadoEn.toISOString()
    };
}

export async function registrarAuditoriaEnBD(data: Omit<Auditoria, "id" | "creadoEn">): Promise<AuditoriaRegistro> {
    const aud = await prisma.auditoria.create({
        data
    });
    return mapearAuditoria(aud);
}

export async function obtenerRegistrosAuditoria(limite: number = 100): Promise<AuditoriaRegistro[]> {
    const logs = await prisma.auditoria.findMany({
        orderBy: { creadoEn: 'desc' },
        take: limite
    });
    return logs.map(mapearAuditoria);
}
