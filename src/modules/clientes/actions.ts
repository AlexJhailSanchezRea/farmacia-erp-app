"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    servicioObtenerClientes,
    servicioCrearCliente,
    servicioActualizarCliente,
    servicioCambiarEstadoCliente
} from "./services";
import { Cliente, CrearClienteInput, ActualizarClienteInput, RespuestaAccion } from "./types";

export async function accionObtenerClientes(): Promise<Cliente[]> {
    return servicioObtenerClientes();
}

export async function accionCrearCliente(datos: CrearClienteInput): Promise<RespuestaAccion<Cliente>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_cliente")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearCliente(datos);
        if (resultado.exito) {
            revalidatePath("/clientes");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.cliente };
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar el cliente." };
    }
}

export async function accionActualizarCliente(datos: ActualizarClienteInput): Promise<RespuestaAccion<Cliente>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "editar_cliente")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioActualizarCliente(datos);
        if (resultado.exito) {
            revalidatePath("/clientes");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.cliente };
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al actualizar el cliente." };
    }
}

export async function accionCambiarEstadoCliente(id: number, estado: EstadoRegistro): Promise<RespuestaAccion> {
    try {
        const resultado = await servicioCambiarEstadoCliente(id, estado);
        if (resultado.exito) {
            revalidatePath("/clientes");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje };
    } catch (error) {
        console.error("Error al cambiar estado de cliente:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al cambiar el estado." };
    }
}
