import { prisma } from "@/lib/prisma";
import { Prisma, TipoMovimientoInventario, TipoComprobante, TipoMovimientoCaja } from "@/generated/prisma/client";
import { CrearVentaInput, VentaCliente } from "./types";

type VentaConRelaciones = Prisma.VentaGetPayload<{
    include: {
        cliente: true,
        detalles: {
            include: { producto: true }
        }
    }
}>;

function mapearVenta(ventaPrisma: VentaConRelaciones): VentaCliente {
    return {
        id: ventaPrisma.id,
        numeroVenta: ventaPrisma.numeroVenta,
        fechaVenta: ventaPrisma.fechaVenta.toISOString(),
        total: Number(ventaPrisma.total),
        observacion: ventaPrisma.observacion,
        estado: ventaPrisma.estado,
        clienteId: ventaPrisma.clienteId,
        creadoEn: ventaPrisma.creadoEn.toISOString(),
        cliente: ventaPrisma.cliente ? {
            id: ventaPrisma.cliente.id,
            nombre: ventaPrisma.cliente.nombre,
            ciNit: ventaPrisma.cliente.ciNit,
            telefono: ventaPrisma.cliente.telefono,
            direccion: ventaPrisma.cliente.direccion,
            correo: ventaPrisma.cliente.correo,
            estado: ventaPrisma.cliente.estado,
            creadoEn: ventaPrisma.cliente.creadoEn.toISOString(),
            actualizadoEn: ventaPrisma.cliente.actualizadoEn.toISOString(),
        } : null,
        detalles: ventaPrisma.detalles.map(d => ({
            id: d.id,
            ventaId: d.ventaId,
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: Number(d.precioUnitario),
            subtotal: Number(d.subtotal),
            producto: d.producto ? {
                id: d.producto.id,
                nombre: d.producto.nombre,
                descripcion: d.producto.descripcion,
                codigoBarra: d.producto.codigoBarra,
                precioCompra: Number(d.producto.precioCompra),
                precioVenta: Number(d.producto.precioVenta),
                stockActual: d.producto.stockActual,
                stockMinimo: d.producto.stockMinimo,
                estado: d.producto.estado,
                categoriaId: d.producto.categoriaId,
                creadoEn: d.producto.creadoEn.toISOString(),
                actualizadoEn: d.producto.actualizadoEn.toISOString(),
            } : undefined
        }))
    };
}

export async function obtenerVentas(): Promise<VentaCliente[]> {
    const ventas = await prisma.venta.findMany({
        orderBy: { fechaVenta: 'desc' },
        include: {
            cliente: true,
            detalles: {
                include: { producto: true }
            }
        }
    });
    return ventas.map(mapearVenta);
}

function generarNumeroVentaUnico(): string {
    const fecha = new Date();
    const ts = fecha.getTime().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VEN-${ts}-${rnd}`;
}

function generarNumeroComprobante(): string {
    const ts = new Date().getTime().toString().slice(-5);
    const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `NV-${ts}-${rnd}`;
}

export async function crearVentaConTransaccion(datos: CrearVentaInput): Promise<VentaCliente> {
    const numVenta = generarNumeroVentaUnico();

    const ventaRegistrada = await prisma.$transaction(async (tx) => {
        let totalCalculado = 0;
        
        // 1. Validar Stock y recalcular total exacto antes de crear nada
        for (const detalle of datos.detalles) {
            const prodReal = await tx.producto.findUniqueOrThrow({ where: { id: detalle.productoId } });
            if (prodReal.estado !== "ACTIVO") {
                throw new Error(`El producto ${prodReal.nombre} no está activo para la venta.`);
            }
            if (prodReal.stockActual < detalle.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${prodReal.nombre}. Disponible: ${prodReal.stockActual}. Solicitado: ${detalle.cantidad}.`);
            }
            totalCalculado += detalle.cantidad * detalle.precioUnitario;
        }

        const detallesData = datos.detalles.map(d => ({
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: new Prisma.Decimal(d.precioUnitario),
            subtotal: new Prisma.Decimal(d.cantidad * d.precioUnitario)
        }));

        // 2. Crear cabecera de la venta
        const nuevaVenta = await tx.venta.create({
            data: {
                numeroVenta: numVenta,
                clienteId: datos.clienteId || null,
                observacion: datos.observacion?.trim() || null,
                total: new Prisma.Decimal(totalCalculado),
                detalles: {
                    create: detallesData
                }
            },
            include: {
                cliente: true,
                detalles: {
                    include: { producto: true }
                }
            }
        });

        // 3. Procesar movimientos y descuentos de stock
        for (const detalle of nuevaVenta.detalles) {
            const productoActual = detalle.producto;
            
            const stockAnterior = productoActual.stockActual;
            const stockNuevo = stockAnterior - detalle.cantidad;

            // Actualizar stock del producto
            await tx.producto.update({
                where: { id: productoActual.id },
                data: { stockActual: stockNuevo }
            });

            // Crear movimiento de inventario (SALIDA)
            await tx.movimientoInventario.create({
                data: {
                    tipoMovimiento: TipoMovimientoInventario.SALIDA,
                    cantidad: detalle.cantidad,
                    stockAnterior: stockAnterior,
                    stockNuevo: stockNuevo,
                    motivo: `Venta ${numVenta}`,
                    ventaId: nuevaVenta.id,
                    productoId: productoActual.id
                }
            });
        }

        // 4. Crear el comprobante
        const numComprobante = generarNumeroComprobante();
        let clienteNombre = "Cliente General";
        
        if (nuevaVenta.cliente) {
            clienteNombre = nuevaVenta.cliente.nombre;
        } else if (datos.clienteId) {
            const c = await tx.cliente.findUnique({ where: { id: datos.clienteId } });
            if (c) clienteNombre = c.nombre;
        }

        await tx.comprobante.create({
            data: {
                numeroComprobante: numComprobante,
                tipoComprobante: TipoComprobante.NOTA_VENTA,
                total: new Prisma.Decimal(totalCalculado),
                clienteNombre: clienteNombre,
                ventaId: nuevaVenta.id
            }
        });

        // 5. Crear Movimiento de Caja (INGRESO)
        await tx.movimientoCaja.create({
            data: {
                tipoMovimiento: TipoMovimientoCaja.INGRESO,
                concepto: `Venta ${numVenta}`,
                monto: new Prisma.Decimal(totalCalculado),
                referencia: clienteNombre,
                ventaId: nuevaVenta.id
            }
        });

        return nuevaVenta;
    });

    return mapearVenta(ventaRegistrada);
}
