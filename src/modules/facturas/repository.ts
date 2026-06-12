import { prisma } from "@/lib/prisma";
import { FacturaDemo } from "@/generated/prisma/client";
import { FacturaConDetalles } from "./types";

export async function repositoryObtenerFacturas(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: FacturaConDetalles[], total: number, totalPages: number }> {
    const whereClause: import("@/generated/prisma/client").Prisma.FacturaDemoWhereInput = q ? {
        OR: [
            { numeroFactura: { contains: q, mode: 'insensitive' as const } },
            { venta: { cliente: { nombre: { contains: q, mode: 'insensitive' as const } } } }
        ]
    } : {};

    const total = await prisma.facturaDemo.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const data = await prisma.facturaDemo.findMany({
        where: whereClause,
        orderBy: { fechaEmision: 'desc' },
        include: {
            venta: {
                include: {
                    cliente: true,
                    detalles: {
                        include: { producto: true }
                    }
                }
            }
        },
        skip: (pagina - 1) * limite,
        take: limite
    });

    return { data, total, totalPages };
}

export async function repositoryObtenerFacturaPorId(id: number): Promise<FacturaConDetalles | null> {
    return prisma.facturaDemo.findUnique({
        where: { id },
        include: {
            venta: {
                include: {
                    cliente: true,
                    detalles: {
                        include: { producto: true }
                    }
                }
            }
        }
    });
}

export async function repositoryObtenerFacturaPorVentaId(ventaId: number): Promise<FacturaDemo | null> {
    return prisma.facturaDemo.findUnique({
        where: { ventaId }
    });
}

export async function repositoryCrearFacturaDemo(ventaId: number, numeroFactura: string, total: number): Promise<FacturaDemo> {
    // Generación de datos simulados para SIAT
    const cufDemo = "CUF-" + Math.random().toString(36).substring(2, 15).toUpperCase();
    const cufdDemo = "CUFD-" + Math.random().toString(36).substring(2, 15).toUpperCase();
    const leyendaDemo = "ESTE DOCUMENTO NO TIENE VALIDEZ LEGAL";

    return prisma.facturaDemo.create({
        data: {
            numeroFactura,
            cuf: cufDemo,
            cufd: cufdDemo,
            leyenda: leyendaDemo,
            total,
            ventaId
        }
    });
}

export async function repositoryObtenerUltimoNumeroFactura(): Promise<number> {
    const ultima = await prisma.facturaDemo.findFirst({
        orderBy: { id: 'desc' }
    });
    
    if (!ultima) return 0;
    
    // Parse F-00000X
    const numStr = ultima.numeroFactura.split('-')[1];
    return parseInt(numStr, 10) || 0;
}
