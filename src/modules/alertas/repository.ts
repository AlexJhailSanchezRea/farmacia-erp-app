import { prisma } from "@/lib/prisma";
import { AlertasSanitarias, LoteAlerta } from "./types";
import { ProductoCliente } from "@/modules/productos/types";
import { LoteProducto, Producto } from "@/generated/prisma/client";

type LoteConProducto = LoteProducto & { producto: Producto };

function mapearLoteAlerta(lotePrisma: LoteConProducto): LoteAlerta {
    const hoy = new Date();
    const vencimiento = new Date(lotePrisma.fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
        id: lotePrisma.id,
        numeroLote: lotePrisma.numeroLote,
        fechaVencimiento: lotePrisma.fechaVencimiento.toISOString(),
        stockActual: lotePrisma.stockActual,
        stockInicial: lotePrisma.stockInicial,
        precioCompra: Number(lotePrisma.precioCompra),
        estado: lotePrisma.estado,
        diasParaVencer: diffDays,
        producto: {
            id: lotePrisma.producto.id,
            nombre: lotePrisma.producto.nombre,
            descripcion: lotePrisma.producto.descripcion,
            codigoBarra: lotePrisma.producto.codigoBarra,
            precioCompra: Number(lotePrisma.producto.precioCompra),
            precioVenta: Number(lotePrisma.producto.precioVenta),
            stockActual: lotePrisma.producto.stockActual,
            stockMinimo: lotePrisma.producto.stockMinimo,
            estado: lotePrisma.producto.estado,
            creadoEn: lotePrisma.producto.creadoEn.toISOString(),
            actualizadoEn: lotePrisma.producto.actualizadoEn.toISOString(),
            categoriaId: lotePrisma.producto.categoriaId,
            principioActivo: lotePrisma.producto.principioActivo,
            laboratorio: lotePrisma.producto.laboratorio,
            presentacion: lotePrisma.producto.presentacion,
            concentracion: lotePrisma.producto.concentracion,
            requiereReceta: lotePrisma.producto.requiereReceta,
        }
    };
}

export async function obtenerAlertasSanitarias(): Promise<AlertasSanitarias> {
    const hoy = new Date();
    
    const dentroDe30Dias = new Date();
    dentroDe30Dias.setDate(hoy.getDate() + 30);
    
    const dentroDe60Dias = new Date();
    dentroDe60Dias.setDate(hoy.getDate() + 60);

    // Vencidos (Con stock)
    const vencidosData = await prisma.loteProducto.findMany({
        where: {
            fechaVencimiento: { lt: hoy },
            stockActual: { gt: 0 }
        },
        include: { producto: true },
        orderBy: { fechaVencimiento: 'asc' }
    });

    // Próximos 30 Días (Con stock, no vencidos aún)
    const proximos30Data = await prisma.loteProducto.findMany({
        where: {
            fechaVencimiento: {
                gte: hoy,
                lte: dentroDe30Dias
            },
            stockActual: { gt: 0 }
        },
        include: { producto: true },
        orderBy: { fechaVencimiento: 'asc' }
    });

    // Próximos 60 Días (Entre 31 y 60 días, con stock)
    const proximos60Data = await prisma.loteProducto.findMany({
        where: {
            fechaVencimiento: {
                gt: dentroDe30Dias,
                lte: dentroDe60Dias
            },
            stockActual: { gt: 0 }
        },
        include: { producto: true },
        orderBy: { fechaVencimiento: 'asc' }
    });

    // Stock Bajo Global (Menor o igual al mínimo)
    const stockBajoData = await prisma.producto.findMany({
        where: {
            estado: 'ACTIVO',
            stockActual: {
                lte: prisma.producto.fields.stockMinimo
            }
        },
        orderBy: { stockActual: 'asc' }
    });

    const stockBajoClient = stockBajoData.map(p => ({
        ...p,
        precioCompra: Number(p.precioCompra),
        precioVenta: Number(p.precioVenta),
        creadoEn: p.creadoEn.toISOString(),
        actualizadoEn: p.actualizadoEn.toISOString()
    })) as ProductoCliente[];

    // Lotes Vacíos
    const vaciosData = await prisma.loteProducto.findMany({
        where: { stockActual: 0 },
        include: { producto: true },
        orderBy: { actualizadoEn: 'desc' },
        take: 50 // Limitar para no saturar si hay muchos
    });

    return {
        vencidos: vencidosData.map(mapearLoteAlerta),
        proximos30Dias: proximos30Data.map(mapearLoteAlerta),
        proximos60Dias: proximos60Data.map(mapearLoteAlerta),
        stockBajoGlobal: stockBajoClient,
        lotesVacios: vaciosData.map(mapearLoteAlerta)
    };
}
