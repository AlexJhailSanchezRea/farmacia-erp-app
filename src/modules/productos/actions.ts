"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    servicioObtenerProductos,
    servicioCrearProducto,
    servicioActualizarProducto,
    servicioCambiarEstadoProducto,
    servicioObtenerCategoriasActivas
} from "./services";
import { ProductoCliente, CrearProductoInput, ActualizarProductoInput, RespuestaAccionProducto } from "./types";
import { Categoria } from "@/modules/categorias/types";

export async function accionObtenerProductos(): Promise<ProductoCliente[]> {
    return servicioObtenerProductos();
}

export async function accionObtenerCategoriasActivas(): Promise<Categoria[]> {
    return servicioObtenerCategoriasActivas();
}

export async function accionCrearProducto(datos: CrearProductoInput): Promise<RespuestaAccion<Producto>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_producto")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearProducto(datos);
        if (resultado.exito) {
            revalidatePath("/productos");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.producto };
    } catch (error) {
        console.error("Error al crear producto:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al crear el producto." };
    }
}

export async function accionActualizarProducto(datos: ActualizarProductoInput): Promise<RespuestaAccion<Producto>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "editar_producto")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioActualizarProducto(datos);
        if (resultado.exito) {
            revalidatePath("/productos");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.producto };
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al actualizar el producto." };
    }
}

export async function accionCambiarEstadoProducto(id: number, estado: EstadoRegistro): Promise<RespuestaAccionProducto> {
    try {
        const resultado = await servicioCambiarEstadoProducto(id, estado);
        if (resultado.exito) {
            revalidatePath("/productos");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje };
    } catch (error) {
        console.error("Error al cambiar estado de producto:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al cambiar el estado." };
    }
}
