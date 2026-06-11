import { prisma } from "@/lib/prisma";
import { FacturaDemo } from "@/generated/prisma/client";
import { FacturaConDetalles } from "./types";

export async function repositoryObtenerFacturas(): Promise<FacturaConDetalles[]> {
    return prisma.facturaDemo.findMany({
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
        }
    });
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
