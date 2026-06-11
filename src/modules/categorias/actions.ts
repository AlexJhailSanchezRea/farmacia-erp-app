"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    servicioObtenerCategorias,
    servicioCrearCategoria,
    servicioActualizarCategoria,
    servicioCambiarEstadoCategoria 
} from "./services";
import { Categoria, CrearCategoriaInput, ActualizarCategoriaInput, RespuestaAccion } from "./types";

export async function accionObtenerCategorias(): Promise<Categoria[]> {
    return servicioObtenerCategorias();
}

export async function accionCrearCategoria(datos: CrearCategoriaInput): Promise<RespuestaAccion<Categoria>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_categoria")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearCategoria(datos);
        if (resultado.exito) {
            revalidatePath("/categorias");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.categoria };
    } catch (error) {
        console.error("Error al crear categoría:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al crear la categoría." };
    }
}

export async function accionActualizarCategoria(datos: ActualizarCategoriaInput): Promise<RespuestaAccion<Categoria>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_categoria")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioActualizarCategoria(datos);
        if (resultado.exito) {
            revalidatePath("/categorias");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.categoria };
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al actualizar la categoría." };
    }
}

export async function accionCambiarEstadoCategoria(id: number, estado: EstadoRegistro): Promise<RespuestaAccion> {
    try {
        const resultado = await servicioCambiarEstadoCategoria(id, estado);
        if (resultado.exito) {
            revalidatePath("/categorias");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje };
    } catch (error) {
        console.error("Error al cambiar estado de categoría:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al cambiar el estado." };
    }
}
