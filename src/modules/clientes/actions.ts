"use server";

import { revalidatePath } from "next/cache";
import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    servicioObtenerClientes,
    servicioCrearCliente,
    servicioActualizarCliente,
    servicioCambiarEstadoCliente
} from "./services";
import { ClienteCliente, CrearClienteInput, ActualizarClienteInput, RespuestaAccionCliente } from "./types";

export async function accionObtenerClientes(): Promise<ClienteCliente[]> {
    return servicioObtenerClientes();
}

export async function accionCrearCliente(datos: CrearClienteInput): Promise<RespuestaAccionCliente<ClienteCliente>> {
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

export async function accionActualizarCliente(datos: ActualizarClienteInput): Promise<RespuestaAccionCliente<ClienteCliente>> {
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

export async function accionCambiarEstadoCliente(id: number, estado: EstadoRegistro): Promise<RespuestaAccionCliente> {
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
