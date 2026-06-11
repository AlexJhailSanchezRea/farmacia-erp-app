import { EstadoRegistro } from "@/generated/prisma/client";
import { Categoria } from "@/modules/categorias/types";

// Tipo serializado para enviar al cliente (sin objetos Decimal de Prisma)
export interface ProductoCliente {
    id: number;
    nombre: string;
    descripcion: string | null;
    codigoBarra: string | null;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    estado: EstadoRegistro;
    creadoEn: string;
    actualizadoEn: string;
    categoriaId: number;
    categoria?: Categoria; // Relación serializada opcional
}

export interface CrearProductoInput {
    nombre: string;
    descripcion?: string;
    codigoBarra?: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    categoriaId: number;
}

export interface ActualizarProductoInput {
    id: number;
    nombre: string;
    descripcion?: string;
    codigoBarra?: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    categoriaId: number;
}

export interface RespuestaAccionProducto<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
