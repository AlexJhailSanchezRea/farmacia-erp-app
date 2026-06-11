import { prisma } from "@/lib/prisma";
import { ReporteMetricas } from "./types";
import { calcularResumenCaja } from "@/modules/caja/repository";

export async function obtenerReporteGeneral(): Promise<ReporteMetricas> {
    const fechaActual = new Date();
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    // 1. Resumen general (Métricas del mes)
    const ventasTotalesMes = await prisma.venta.aggregate({
        _sum: { total: true },
        where: { estado: "ACTIVO", fechaVenta: { gte: inicioMes } }
    });

    const comprasTotalesMes = await prisma.compra.aggregate({
        _sum: { total: true },
        where: { estado: "ACTIVO", fechaCompra: { gte: inicioMes } }
    });

    const saldoCaja = await calcularResumenCaja();

    const productosActivos = await prisma.producto.count({
        where: { estado: "ACTIVO" }
    });

    // Productos con stock <= stockMinimo
    const productosDB = await prisma.producto.findMany({
        where: { estado: "ACTIVO" },
        select: { stockActual: true, stockMinimo: true }
    });
    const productosStockBajo = productosDB.filter(p => p.stockActual <= p.stockMinimo).length;

    const entradasInventarioMes = await prisma.movimientoInventario.count({
        where: { tipoMovimiento: "ENTRADA", creadoEn: { gte: inicioMes } }
    });

    const salidasInventarioMes = await prisma.movimientoInventario.count({
        where: { tipoMovimiento: "SALIDA", creadoEn: { gte: inicioMes } }
    });

    const dentroDe30Dias = new Date();
    dentroDe30Dias.setDate(fechaActual.getDate() + 30);

    const alertasVencimiento = await prisma.loteProducto.count({
        where: {
            stockActual: { gt: 0 },
            fechaVencimiento: { lte: dentroDe30Dias }
        }
    });

    // 2. Últimas listas
    const ultimasVentas = await prisma.venta.findMany({
        where: { estado: "ACTIVO" },
        orderBy: { fechaVenta: "desc" },
        take: 5
    });

    const ultimasCompras = await prisma.compra.findMany({
        where: { estado: "ACTIVO" },
        orderBy: { fechaCompra: "desc" },
        take: 5
    });

    const ultimosMovimientosInventario = await prisma.movimientoInventario.findMany({
        orderBy: { creadoEn: "desc" },
        take: 5,
        include: { producto: true }
    });

    const ultimosMovimientosCaja = await prisma.movimientoCaja.findMany({
        where: { estado: "ACTIVO" },
        orderBy: { fechaMovimiento: "desc" },
        take: 5
    });

    const topProductosDB = await prisma.detalleVenta.groupBy({
        by: ['productoId'],
        where: { venta: { estado: "ACTIVO" } },
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 5
    });

    const topProductosIds = topProductosDB.map(t => t.productoId);
    const topProductosData = await prisma.producto.findMany({
        where: { id: { in: topProductosIds } }
    });

    const topProductos = topProductosDB.map(t => {
        const prod = topProductosData.find(p => p.id === t.productoId);
        return {
            nombre: prod?.nombre || "Producto desconocido",
            cantidad: t._sum.cantidad || 0
        };
    });

    return {
        resumen: {
            ventasTotalesMes: Number(ventasTotalesMes._sum.total || 0),
            comprasTotalesMes: Number(comprasTotalesMes._sum.total || 0),
            saldoCaja: saldoCaja.saldoActual,
            productosActivos,
            productosStockBajo,
            movimientosEntradaMes: entradasInventarioMes,
            movimientosSalidaMes: salidasInventarioMes,
            ingresosTotales: saldoCaja.totalIngresos,
            egresosTotales: saldoCaja.totalEgresos,
            alertasVencimiento
        },
        ultimasVentas: ultimasVentas.map(v => ({ id: v.id, numero: v.numeroVenta, total: Number(v.total), fecha: v.fechaVenta.toISOString() })),
        ultimasCompras: ultimasCompras.map(c => ({ id: c.id, numero: c.numeroCompra, total: Number(c.total), fecha: c.fechaCompra.toISOString() })),
        ultimosMovimientosInventario: ultimosMovimientosInventario.map(m => ({ 
            id: m.id, 
            tipo: m.tipoMovimiento, 
            producto: m.producto.nombre, 
            cantidad: m.cantidad, 
            fecha: m.creadoEn.toISOString() 
        })),
        ultimosMovimientosCaja: ultimosMovimientosCaja.map(m => ({
            id: m.id,
            tipo: m.tipoMovimiento,
            concepto: m.concepto,
            monto: Number(m.monto),
            fecha: m.fechaMovimiento.toISOString()
        })),
        topProductos
    };
}

export async function exportarVentasDB() {
    const ventas = await prisma.venta.findMany({
        where: { estado: "ACTIVO" },
        include: { cliente: true },
        orderBy: { fechaVenta: "desc" }
    });
    return ventas.map(v => ({
        Numero: v.numeroVenta,
        Fecha: v.fechaVenta.toISOString(),
        Cliente: v.cliente?.nombre || "Cliente General",
        Total: Number(v.total),
        Observacion: v.observacion || ""
    }));
}

export async function exportarComprasDB() {
    const compras = await prisma.compra.findMany({
        where: { estado: "ACTIVO" },
        include: { proveedor: true },
        orderBy: { fechaCompra: "desc" }
    });
    return compras.map(c => ({
        Numero: c.numeroCompra,
        Fecha: c.fechaCompra.toISOString(),
        Proveedor: c.proveedor?.nombre || "Proveedor General",
        Total: Number(c.total),
        Observacion: c.observacion || ""
    }));
}

export async function exportarMovimientosCajaDB() {
    const movimientos = await prisma.movimientoCaja.findMany({
        where: { estado: "ACTIVO" },
        orderBy: { fechaMovimiento: "desc" }
    });
    return movimientos.map(m => ({
        Fecha: m.fechaMovimiento.toISOString(),
        Tipo: m.tipoMovimiento,
        Concepto: m.concepto,
        Monto: Number(m.monto),
        Referencia: m.referencia || ""
    }));
}

export async function exportarProductosStockBajoDB() {
    const productos = await prisma.producto.findMany({
        where: { estado: "ACTIVO" },
        include: { categoria: true },
        orderBy: { nombre: "asc" }
    });
    const stockBajo = productos.filter(p => p.stockActual <= p.stockMinimo);
    return stockBajo.map(p => ({
        CodigoBarra: p.codigoBarra || "",
        Nombre: p.nombre,
        Categoria: p.categoria.nombre,
        StockActual: p.stockActual,
        StockMinimo: p.stockMinimo,
        Laboratorio: p.laboratorio || ""
    }));
}

export async function exportarLotesPorVencerDB() {
    const dentroDe30Dias = new Date();
    dentroDe30Dias.setDate(dentroDe30Dias.getDate() + 30);
    
    const lotes = await prisma.loteProducto.findMany({
        where: {
            stockActual: { gt: 0 },
            fechaVencimiento: { lte: dentroDe30Dias }
        },
        include: { producto: true },
        orderBy: { fechaVencimiento: "asc" }
    });
    return lotes.map(l => ({
        Producto: l.producto.nombre,
        Laboratorio: l.producto.laboratorio || "",
        NumeroLote: l.numeroLote,
        FechaVencimiento: l.fechaVencimiento.toISOString(),
        StockRestante: l.stockActual
    }));
}
