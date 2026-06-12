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

export async function obtenerRegistrosAuditoria(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: AuditoriaRegistro[], total: number, totalPages: number }> {
    const whereClause = q ? {
        OR: [
            { usuarioCorreo: { contains: q, mode: 'insensitive' as const } },
            { modulo: { contains: q, mode: 'insensitive' as const } },
            { accion: { contains: q, mode: 'insensitive' as const } },
            { descripcion: { contains: q, mode: 'insensitive' as const } }
        ]
    } : {};

    const total = await prisma.auditoria.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const logs = await prisma.auditoria.findMany({
        where: whereClause,
        orderBy: { creadoEn: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite
    });
    
    return {
        data: logs.map(mapearAuditoria),
        total,
        totalPages
    };
}
