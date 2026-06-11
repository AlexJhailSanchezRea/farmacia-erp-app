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

export async function obtenerComprobantes(): Promise<ComprobanteCliente[]> {
    const comprobantes = await prisma.comprobante.findMany({
        orderBy: { fechaEmision: 'desc' }
    });
    return comprobantes.map(mapearComprobante);
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
