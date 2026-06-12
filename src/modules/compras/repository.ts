import { prisma } from "@/lib/prisma";
import { Prisma, TipoMovimientoInventario, TipoMovimientoCaja } from "@/generated/prisma/client";
import { CrearCompraInput, CompraCliente } from "./types";

type CompraConRelaciones = Prisma.CompraGetPayload<{
    include: {
        proveedor: true,
        detalles: {
            include: { producto: true }
        }
    }
}>;

function mapearCompra(compraPrisma: CompraConRelaciones): CompraCliente {
    return {
        id: compraPrisma.id,
        numeroCompra: compraPrisma.numeroCompra,
        fechaCompra: compraPrisma.fechaCompra.toISOString(),
        total: Number(compraPrisma.total),
        observacion: compraPrisma.observacion,
        estado: compraPrisma.estado,
        proveedorId: compraPrisma.proveedorId,
        creadoEn: compraPrisma.creadoEn.toISOString(),
        proveedor: compraPrisma.proveedor ? {
            id: compraPrisma.proveedor.id,
            nombre: compraPrisma.proveedor.nombre,
            nit: compraPrisma.proveedor.nit,
            telefono: compraPrisma.proveedor.telefono,
            direccion: compraPrisma.proveedor.direccion,
            correo: compraPrisma.proveedor.correo,
            contacto: compraPrisma.proveedor.contacto,
            estado: compraPrisma.proveedor.estado,
            creadoEn: compraPrisma.proveedor.creadoEn.toISOString(),
            actualizadoEn: compraPrisma.proveedor.actualizadoEn.toISOString(),
        } : undefined,
        detalles: compraPrisma.detalles.map(d => ({
            id: d.id,
            compraId: d.compraId,
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

export async function obtenerCompras(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: CompraCliente[], total: number, totalPages: number }> {
    const whereClause: Prisma.CompraWhereInput = q ? {
        OR: [
            { numeroCompra: { contains: q, mode: 'insensitive' as const } },
            { proveedor: { nombre: { contains: q, mode: 'insensitive' as const } } }
        ]
    } : {};

    const total = await prisma.compra.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const compras = await prisma.compra.findMany({
        where: whereClause,
        orderBy: { fechaCompra: 'desc' },
        include: {
            proveedor: true,
            detalles: {
                include: { producto: true }
            }
        },
        skip: (pagina - 1) * limite,
        take: limite
    });
    
    return {
        data: compras.map(mapearCompra),
        total,
        totalPages
    };
}

function generarNumeroCompraUnico(): string {
    const fecha = new Date();
    const ts = fecha.getTime().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COMP-${ts}-${rnd}`;
}

export async function crearCompraConTransaccion(datos: CrearCompraInput): Promise<CompraCliente> {
    // Calcular totales desde el servidor
    let totalCalculado = 0;
    const detallesData = datos.detalles.map(d => {
        const sub = d.cantidad * d.precioUnitario;
        totalCalculado += sub;
        return {
            productoId: d.productoId,
            cantidad: d.cantidad,
            precioUnitario: new Prisma.Decimal(d.precioUnitario),
            subtotal: new Prisma.Decimal(sub)
        };
    });

    const numCompra = generarNumeroCompraUnico();

    const compraRegistrada = await prisma.$transaction(async (tx) => {
        // 0. Validar Caja Abierta
        const cajaAbierta = await tx.cajaTurno.findFirst({ where: { estado: "ABIERTA" } });
        if (!cajaAbierta) {
            throw new Error("Debe abrir caja antes de registrar operaciones de dinero (Compra).");
        }

        // 1. Crear la cabecera y el detalle de la compra
        const nuevaCompra = await tx.compra.create({
            data: {
                numeroCompra: numCompra,
                proveedorId: datos.proveedorId,
                observacion: datos.observacion?.trim() || null,
                total: new Prisma.Decimal(totalCalculado),
                detalles: {
                    create: detallesData
                }
            },
            include: {
                proveedor: true,
                detalles: {
                    include: { producto: true }
                }
            }
        });

        // 2. Procesar cada detalle: actualizar stock y registrar movimiento
        for (const detalleInput of datos.detalles) {
            const detalleGrabado = nuevaCompra.detalles.find(d => d.productoId === detalleInput.productoId);
            if (!detalleGrabado) continue;
            
            const productoActual = detalleGrabado.producto;
            
            const stockAnterior = productoActual.stockActual;
            const stockNuevo = stockAnterior + detalleInput.cantidad;

            // 2.a Crear o Actualizar Lote (Farmacia)
            const lote = await tx.loteProducto.upsert({
                where: {
                    productoId_numeroLote: {
                        productoId: productoActual.id,
                        numeroLote: detalleInput.numeroLote
                    }
                },
                create: {
                    productoId: productoActual.id,
                    numeroLote: detalleInput.numeroLote,
                    fechaVencimiento: new Date(detalleInput.fechaVencimiento),
                    stockActual: detalleInput.cantidad,
                    stockInicial: detalleInput.cantidad,
                    precioCompra: new Prisma.Decimal(detalleInput.precioUnitario)
                },
                update: {
                    stockActual: { increment: detalleInput.cantidad },
                    stockInicial: { increment: detalleInput.cantidad },
                    precioCompra: new Prisma.Decimal(detalleInput.precioUnitario)
                }
            });

            // Actualizar stock del producto
            await tx.producto.update({
                where: { id: productoActual.id },
                data: { stockActual: stockNuevo }
            });

            // Crear movimiento de inventario (ENTRADA)
            await tx.movimientoInventario.create({
                data: {
                    tipoMovimiento: TipoMovimientoInventario.ENTRADA,
                    cantidad: detalleInput.cantidad,
                    stockAnterior: stockAnterior,
                    stockNuevo: stockNuevo,
                    motivo: `Compra ${numCompra} - Lote ${detalleInput.numeroLote}`,
                    compraId: nuevaCompra.id,
                    productoId: productoActual.id,
                    loteId: lote.id
                }
            });
        }

        // 3. Crear Movimiento de Caja (EGRESO)
        await tx.movimientoCaja.create({
            data: {
                tipoMovimiento: TipoMovimientoCaja.EGRESO,
                concepto: `Compra ${numCompra}`,
                monto: new Prisma.Decimal(totalCalculado),
                referencia: nuevaCompra.proveedor.nombre,
                compraId: nuevaCompra.id,
                cajaTurnoId: cajaAbierta.id
            }
        });

        return nuevaCompra;
    });

    return mapearCompra(compraRegistrada);
}
