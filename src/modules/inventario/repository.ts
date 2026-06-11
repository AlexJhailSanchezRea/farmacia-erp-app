import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MovimientoInventarioCliente } from "./types";

type MovimientoConProducto = Prisma.MovimientoInventarioGetPayload<{
    include: { producto: { include: { categoria: true } } }
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
        ventaId: mov.ventaId,
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
            principioActivo: mov.producto.principioActivo,
            laboratorio: mov.producto.laboratorio,
            presentacion: mov.producto.presentacion,
            concentracion: mov.producto.concentracion,
            requiereReceta: mov.producto.requiereReceta,
            categoria: mov.producto.categoria ? { 
                id: mov.producto.categoria.id,
                nombre: mov.producto.categoria.nombre,
                descripcion: mov.producto.categoria.descripcion,
                estado: mov.producto.categoria.estado,
                creadoEn: mov.producto.categoria.creadoEn,
                actualizadoEn: mov.producto.categoria.actualizadoEn
            } : undefined
        } : undefined
    };
}

export async function obtenerMovimientosInventario(): Promise<MovimientoInventarioCliente[]> {
    const movimientos = await prisma.movimientoInventario.findMany({
        orderBy: { creadoEn: 'desc' },
        include: { producto: { include: { categoria: true } } }
    });
    return movimientos.map(mapearMovimiento);
}
