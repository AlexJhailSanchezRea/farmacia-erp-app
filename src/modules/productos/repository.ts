import { prisma } from "@/lib/prisma";
import { EstadoRegistro, Prisma } from "@/generated/prisma/client";
import { CrearProductoInput, ActualizarProductoInput, ProductoCliente } from "./types";

type ProductoConCategoria = Prisma.ProductoGetPayload<{
    include: { categoria: true, lotes: true }
}>;

// Helper para convertir el Producto de Prisma a ProductoCliente
// para evitar problemas de hidratación con objetos Date y Decimal
function mapearProducto(productoPrisma: ProductoConCategoria): ProductoCliente {
    return {
        id: productoPrisma.id,
        nombre: productoPrisma.nombre,
        descripcion: productoPrisma.descripcion,
        codigoBarra: productoPrisma.codigoBarra,
        precioCompra: Number(productoPrisma.precioCompra),
        precioVenta: Number(productoPrisma.precioVenta),
        stockActual: productoPrisma.stockActual,
        stockMinimo: productoPrisma.stockMinimo,
        estado: productoPrisma.estado,
        creadoEn: productoPrisma.creadoEn.toISOString(),
        actualizadoEn: productoPrisma.actualizadoEn.toISOString(),
        categoriaId: productoPrisma.categoriaId,
        categoria: productoPrisma.categoria ? {
            id: productoPrisma.categoria.id,
            nombre: productoPrisma.categoria.nombre,
            descripcion: productoPrisma.categoria.descripcion,
            estado: productoPrisma.categoria.estado,
            creadoEn: productoPrisma.categoria.creadoEn,
            actualizadoEn: productoPrisma.categoria.actualizadoEn,
        } : undefined,
        principioActivo: productoPrisma.principioActivo,
        laboratorio: productoPrisma.laboratorio,
        presentacion: productoPrisma.presentacion,
        concentracion: productoPrisma.concentracion,
        requiereReceta: productoPrisma.requiereReceta,
        lotes: productoPrisma.lotes?.map(l => ({
            id: l.id,
            numeroLote: l.numeroLote,
            fechaVencimiento: l.fechaVencimiento.toISOString(),
            stockActual: l.stockActual,
            stockInicial: l.stockInicial,
            precioCompra: Number(l.precioCompra),
            estado: l.estado
        })) || []
    };
}

export async function obtenerProductos(): Promise<ProductoCliente[]> {
    const productos = await prisma.producto.findMany({
        include: {
            categoria: true,
            lotes: true
        },
        orderBy: {
            nombre: 'asc'
        }
    });
    return productos.map(mapearProducto);
}

export async function buscarProductoPorNombre(nombre: string): Promise<ProductoCliente | null> {
    const producto = await prisma.producto.findFirst({
        where: { nombre },
        include: { categoria: true, lotes: true }
    });
    return producto ? mapearProducto(producto) : null;
}

export async function buscarProductoPorId(id: number): Promise<ProductoCliente | null> {
    const producto = await prisma.producto.findUnique({
        where: { id },
        include: { categoria: true, lotes: true }
    });
    return producto ? mapearProducto(producto) : null;
}

export async function crearProducto(datos: CrearProductoInput): Promise<ProductoCliente> {
    const producto = await prisma.producto.create({
        data: {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || null,
            codigoBarra: datos.codigoBarra?.trim() || null,
            precioCompra: datos.precioCompra,
            precioVenta: datos.precioVenta,
            stockActual: datos.stockActual,
            stockMinimo: datos.stockMinimo,
            categoriaId: datos.categoriaId,
            principioActivo: datos.principioActivo?.trim() || null,
            laboratorio: datos.laboratorio?.trim() || null,
            presentacion: datos.presentacion?.trim() || null,
            concentracion: datos.concentracion?.trim() || null,
            requiereReceta: datos.requiereReceta || false
        },
        include: {
            categoria: true,
            lotes: true
        }
    });
    return mapearProducto(producto);
}

export async function actualizarProducto(datos: ActualizarProductoInput): Promise<ProductoCliente> {
    const producto = await prisma.producto.update({
        where: { id: datos.id },
        data: {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || null,
            codigoBarra: datos.codigoBarra?.trim() || null,
            precioCompra: datos.precioCompra,
            precioVenta: datos.precioVenta,
            stockActual: datos.stockActual,
            stockMinimo: datos.stockMinimo,
            categoriaId: datos.categoriaId,
            principioActivo: datos.principioActivo?.trim() || null,
            laboratorio: datos.laboratorio?.trim() || null,
            presentacion: datos.presentacion?.trim() || null,
            concentracion: datos.concentracion?.trim() || null,
            requiereReceta: datos.requiereReceta || false
        },
        include: {
            categoria: true,
            lotes: true
        }
    });
    return mapearProducto(producto);
}

export async function cambiarEstadoProducto(id: number, estado: EstadoRegistro): Promise<ProductoCliente> {
    const producto = await prisma.producto.update({
        where: { id },
        data: { estado },
        include: {
            categoria: true,
            lotes: true
        }
    });
    return mapearProducto(producto);
}
