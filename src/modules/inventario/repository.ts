import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MovimientoInventarioCliente } from "./types";

type MovimientoConProducto = Prisma.MovimientoInventarioGetPayload<{
    include: { producto: true }
}>;

function mapearMovimiento(mov: MovimientoConProducto): MovimientoInventarioCliente {
    return {
        id: mov.id,
        tipoMovimiento: mov.tipoMovimiento,
        cantidad: mov.cantidad,
        stockAnterior: mov.stockAnterior,
        stockNuevo: mov.stockNuevo,
        motivo: mov.motivo,
        referencia: mov.referencia,
        creadoEn: mov.creadoEn.toISOString(),
        productoId: mov.productoId,
        compraId: mov.compraId,
        producto: mov.producto ? {
            id: mov.producto.id,
            nombre: mov.producto.nombre,
            descripcion: mov.producto.descripcion,
            codigoBarra: mov.producto.codigoBarra,
            precioCompra: Number(mov.producto.precioCompra),
            precioVenta: Number(mov.producto.precioVenta),
            stockActual: mov.producto.stockActual,
            stockMinimo: mov.producto.stockMinimo,
            estado: mov.producto.estado,
            categoriaId: mov.producto.categoriaId,
            creadoEn: mov.producto.creadoEn.toISOString(),
            actualizadoEn: mov.producto.actualizadoEn.toISOString(),
        } : undefined
    };
}

export async function obtenerMovimientosInventario(): Promise<MovimientoInventarioCliente[]> {
    const movimientos = await prisma.movimientoInventario.findMany({
        orderBy: { creadoEn: 'desc' },
        include: { producto: true }
    });
    return movimientos.map(mapearMovimiento);
}
