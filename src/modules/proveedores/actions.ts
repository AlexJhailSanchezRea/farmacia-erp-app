"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    servicioObtenerProveedores,
    servicioCrearProveedor,
    servicioActualizarProveedor,
    servicioCambiarEstadoProveedor
} from "./services";
import { ProveedorCliente, CrearProveedorInput, ActualizarProveedorInput, RespuestaAccionProveedor } from "./types";

export async function accionObtenerProveedores(): Promise<ProveedorCliente[]> {
    return servicioObtenerProveedores();
}

export async function accionCrearProveedor(datos: CrearProveedorInput): Promise<RespuestaAccion<Proveedor>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_proveedor")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearProveedor(datos);
        if (resultado.exito) {
            revalidatePath("/proveedores");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.proveedor };
    } catch (error) {
        console.error("Error al registrar proveedor:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar el proveedor." };
    }
}

export async function accionActualizarProveedor(datos: ActualizarProveedorInput): Promise<RespuestaAccion<Proveedor>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "editar_proveedor")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioActualizarProveedor(datos);
        if (resultado.exito) {
            revalidatePath("/proveedores");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.proveedor };
    } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al actualizar el proveedor." };
    }
}

export async function accionCambiarEstadoProveedor(id: number, estado: EstadoRegistro): Promise<RespuestaAccionProveedor> {
    try {
        const resultado = await servicioCambiarEstadoProveedor(id, estado);
        if (resultado.exito) {
            revalidatePath("/proveedores");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje };
    } catch (error) {
        console.error("Error al cambiar estado de proveedor:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al cambiar el estado." };
    }
}
