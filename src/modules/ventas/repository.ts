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
        motivoAnulacion: ventaPrisma.motivoAnulacion,
        fechaAnulacion: ventaPrisma.fechaAnulacion?.toISOString() || null,
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
                principioActivo: d.producto.principioActivo,
                laboratorio: d.producto.laboratorio,
                presentacion: d.producto.presentacion,
                concentracion: d.producto.concentracion,
                requiereReceta: d.producto.requiereReceta,
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

        // 3. Procesar movimientos y descuentos de stock (FEFO)
        for (const detalle of nuevaVenta.detalles) {
            const productoActual = detalle.producto;
            let cantidadRestante = detalle.cantidad;
            
            const stockAnterior = productoActual.stockActual;
            const stockNuevo = stockAnterior - detalle.cantidad;

            // Lógica FEFO: Obtener lotes activos ordenados por vencimiento ASC
            const lotesDisponibles = await tx.loteProducto.findMany({
                where: {
                    productoId: productoActual.id,
                    estado: "ACTIVO",
                    stockActual: { gt: 0 },
                    fechaVencimiento: { gt: new Date() } // Solo lotes no vencidos
                },
                orderBy: { fechaVencimiento: 'asc' }
            });

            const stockValidoTotal = lotesDisponibles.reduce((sum, l) => sum + l.stockActual, 0);
            if (stockValidoTotal < detalle.cantidad) {
                throw new Error(`Stock insuficiente o vencido para el producto ${productoActual.nombre}. Stock no vencido: ${stockValidoTotal}. Solicitado: ${detalle.cantidad}.`);
            }

            // Actualizar stock global del producto
            await tx.producto.update({
                where: { id: productoActual.id },
                data: { stockActual: stockNuevo }
            });

            // Descontar por lote (FEFO)
            for (const lote of lotesDisponibles) {
                if (cantidadRestante <= 0) break;

                const cantidadADescontar = Math.min(lote.stockActual, cantidadRestante);

                // Actualizar stock del lote
                await tx.loteProducto.update({
                    where: { id: lote.id },
                    data: { stockActual: lote.stockActual - cantidadADescontar }
                });

                // Crear movimiento de inventario (SALIDA) por cada lote afectado
                await tx.movimientoInventario.create({
                    data: {
                        tipoMovimiento: TipoMovimientoInventario.SALIDA,
                        cantidad: cantidadADescontar,
                        stockAnterior: lote.stockActual,
                        stockNuevo: lote.stockActual - cantidadADescontar,
                        motivo: `Venta ${numVenta} - Lote ${lote.numeroLote}`,
                        ventaId: nuevaVenta.id,
                        productoId: productoActual.id,
                        loteId: lote.id
                    }
                });

                cantidadRestante -= cantidadADescontar;
            }
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

export async function anularVentaConTransaccion(idVenta: number, motivo: string): Promise<VentaCliente> {
    const ventaAnulada = await prisma.$transaction(async (tx) => {
        // 1. Obtener la venta con comprobante
        const venta = await tx.venta.findUniqueOrThrow({
            where: { id: idVenta },
            include: { comprobante: true }
        });

        if (venta.estado === "INACTIVO") {
            throw new Error("La venta ya se encuentra anulada.");
        }

        // 2. Cambiar estado de venta a INACTIVO
        const ventaActualizada = await tx.venta.update({
            where: { id: idVenta },
            data: {
                estado: "INACTIVO",
                motivoAnulacion: motivo,
                fechaAnulacion: new Date()
            },
            include: {
                cliente: true,
                detalles: {
                    include: { producto: true }
                }
            }
        });

        // 3. Cambiar estado de comprobante a INACTIVO
        if (venta.comprobante) {
            await tx.comprobante.update({
                where: { id: venta.comprobante.id },
                data: { estado: "INACTIVO" }
            });
        }

        // 4. Devolver stock
        // Buscar movimientos de salida originales de esta venta
        const movimientosSalida = await tx.movimientoInventario.findMany({
            where: { ventaId: idVenta, tipoMovimiento: "SALIDA" }
        });

        for (const mov of movimientosSalida) {
            // Devolver al producto global
            const productoActual = await tx.producto.findUniqueOrThrow({ where: { id: mov.productoId } });
            await tx.producto.update({
                where: { id: mov.productoId },
                data: { stockActual: productoActual.stockActual + mov.cantidad }
            });

            // Devolver al lote si aplica
            if (mov.loteId) {
                const loteActual = await tx.loteProducto.findUniqueOrThrow({ where: { id: mov.loteId } });
                await tx.loteProducto.update({
                    where: { id: mov.loteId },
                    data: { stockActual: loteActual.stockActual + mov.cantidad }
                });

                // Registrar movimiento de entrada (Devolución)
                await tx.movimientoInventario.create({
                    data: {
                        tipoMovimiento: "ENTRADA",
                        cantidad: mov.cantidad,
                        stockAnterior: loteActual.stockActual,
                        stockNuevo: loteActual.stockActual + mov.cantidad,
                        motivo: `Anulación de Venta ${venta.numeroVenta}`,
                        ventaId: idVenta,
                        productoId: mov.productoId,
                        loteId: mov.loteId
                    }
                });
            } else {
                // Si por alguna razón no tenía loteId, igual registrar entrada al producto
                await tx.movimientoInventario.create({
                    data: {
                        tipoMovimiento: "ENTRADA",
                        cantidad: mov.cantidad,
                        stockAnterior: productoActual.stockActual,
                        stockNuevo: productoActual.stockActual + mov.cantidad,
                        motivo: `Anulación de Venta ${venta.numeroVenta}`,
                        ventaId: idVenta,
                        productoId: mov.productoId
                    }
                });
            }
        }

        // 5. Crear Movimiento de Caja de reverso (EGRESO)
        await tx.movimientoCaja.create({
            data: {
                tipoMovimiento: "EGRESO",
                concepto: `Anulación de Venta ${venta.numeroVenta}`,
                monto: venta.total,
                referencia: `ANULACION-VENTA-${idVenta}`,
                // No asignamos ventaId para no violar @unique
            }
        });

        return ventaActualizada;
    });

    return mapearVenta(ventaAnulada);
}
