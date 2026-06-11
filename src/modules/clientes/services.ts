import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    obtenerClientes as repoObtenerClientes,
    crearCliente as repoCrearCliente,
    actualizarCliente as repoActualizarCliente,
    buscarClientePorNombre,
    buscarClientePorId,
    cambiarEstadoCliente as repoCambiarEstadoCliente
} from "./repository";
import { ClienteCliente, CrearClienteInput, ActualizarClienteInput } from "./types";
import { validarCrearCliente, validarActualizarCliente } from "./validations";

export async function servicioObtenerClientes(): Promise<ClienteCliente[]> {
    return repoObtenerClientes();
}

export async function servicioCrearCliente(datos: CrearClienteInput): Promise<{exito: boolean; mensaje: string; cliente?: ClienteCliente}> {
    const errorValidacion = validarCrearCliente(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const existe = await buscarClientePorNombre(datos.nombre.trim());
    if (existe) {
        return { exito: false, mensaje: "Ya existe un cliente con ese nombre." };
    }

    const nuevoCliente = await repoCrearCliente(datos);
    return { exito: true, mensaje: "Cliente registrado exitosamente.", cliente: nuevoCliente };
}

export async function servicioActualizarCliente(datos: ActualizarClienteInput): Promise<{exito: boolean; mensaje: string; cliente?: ClienteCliente}> {
    const errorValidacion = validarActualizarCliente(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const actual = await buscarClientePorId(datos.id);
    if (!actual) {
        return { exito: false, mensaje: "El cliente no existe." };
    }

    if (actual.nombre.toLowerCase() !== datos.nombre.trim().toLowerCase()) {
        const existe = await buscarClientePorNombre(datos.nombre.trim());
        if (existe) {
            return { exito: false, mensaje: "Ya existe otro cliente con ese nombre." };
        }
    }

    const clienteActualizado = await repoActualizarCliente(datos);
    return { exito: true, mensaje: "Cliente actualizado exitosamente.", cliente: clienteActualizado };
}

export async function servicioCambiarEstadoCliente(id: number, nuevoEstado: EstadoRegistro): Promise<{exito: boolean; mensaje: string}> {
    if (!id || id <= 0) {
        return { exito: false, mensaje: "ID de cliente inválido." };
    }

    const actual = await buscarClientePorId(id);
    if (!actual) {
        return { exito: false, mensaje: "El cliente no existe." };
    }

    await repoCambiarEstadoCliente(id, nuevoEstado);
    const msj = nuevoEstado === EstadoRegistro.ACTIVO ? "Cliente reactivado." : "Cliente desactivado.";
    return { exito: true, mensaje: msj };
}
