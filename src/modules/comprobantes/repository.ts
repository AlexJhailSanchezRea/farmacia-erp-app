import { prisma } from "@/lib/prisma";
import { Comprobante } from "@/generated/prisma/client";
import { ComprobanteCliente } from "./types";

function mapearComprobante(comp: Comprobante): ComprobanteCliente {
    return {
        id: comp.id,
        numeroComprobante: comp.numeroComprobante,
        tipoComprobante: comp.tipoComprobante,
        fechaEmision: comp.fechaEmision.toISOString(),
        total: Number(comp.total),
        clienteNombre: comp.clienteNombre,
        estado: comp.estado,
        ventaId: comp.ventaId,
        creadoEn: comp.creadoEn.toISOString()
    };
}

export async function obtenerComprobantes(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: ComprobanteCliente[], total: number, totalPages: number }> {
    const whereClause: import("@/generated/prisma/client").Prisma.ComprobanteWhereInput = q ? {
        OR: [
            { numeroComprobante: { contains: q, mode: 'insensitive' as const } },
            { clienteNombre: { contains: q, mode: 'insensitive' as const } }
        ]
    } : {};

    const total = await prisma.comprobante.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const comprobantes = await prisma.comprobante.findMany({
        where: whereClause,
        orderBy: { fechaEmision: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite
    });
    
    return {
        data: comprobantes.map(mapearComprobante),
        total,
        totalPages
    };
}

export async function obtenerComprobantePorId(id: number): Promise<import('./types').ComprobanteDetalleCliente | null> {
    const comp = await prisma.comprobante.findUnique({
        where: { id },
        include: {
            venta: {
                include: {
                    detalles: {
                        include: {
                            producto: true
                        }
                    }
                }
            }
        }
    });

    if (!comp) return null;

    return {
        ...mapearComprobante(comp),
        detalles: comp.venta.detalles.map(d => ({
            id: d.id,
            productoNombre: d.producto.nombre,
            cantidad: d.cantidad,
            precioUnitario: Number(d.precioUnitario),
            subtotal: Number(d.subtotal)
        }))
    };
}
