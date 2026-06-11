import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    obtenerProveedores as repoObtenerProveedores,
    crearProveedor as repoCrearProveedor,
    actualizarProveedor as repoActualizarProveedor,
    buscarProveedorPorNombre,
    buscarProveedorPorId,
    cambiarEstadoProveedor as repoCambiarEstadoProveedor
} from "./repository";
import { ProveedorCliente, CrearProveedorInput, ActualizarProveedorInput } from "./types";
import { validarCrearProveedor, validarActualizarProveedor } from "./validations";

export async function servicioObtenerProveedores(): Promise<ProveedorCliente[]> {
    return repoObtenerProveedores();
}

export async function servicioCrearProveedor(datos: CrearProveedorInput): Promise<{exito: boolean; mensaje: string; proveedor?: ProveedorCliente}> {
    const errorValidacion = validarCrearProveedor(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const existe = await buscarProveedorPorNombre(datos.nombre.trim());
    if (existe) {
        return { exito: false, mensaje: "Ya existe un proveedor con ese nombre." };
    }

    const nuevoProveedor = await repoCrearProveedor(datos);
    return { exito: true, mensaje: "Proveedor registrado exitosamente.", proveedor: nuevoProveedor };
}

export async function servicioActualizarProveedor(datos: ActualizarProveedorInput): Promise<{exito: boolean; mensaje: string; proveedor?: ProveedorCliente}> {
    const errorValidacion = validarActualizarProveedor(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const actual = await buscarProveedorPorId(datos.id);
    if (!actual) {
        return { exito: false, mensaje: "El proveedor no existe." };
    }

    if (actual.nombre.toLowerCase() !== datos.nombre.trim().toLowerCase()) {
        const existe = await buscarProveedorPorNombre(datos.nombre.trim());
        if (existe) {
            return { exito: false, mensaje: "Ya existe otro proveedor con ese nombre." };
        }
    }

    const proveedorActualizado = await repoActualizarProveedor(datos);
    return { exito: true, mensaje: "Proveedor actualizado exitosamente.", proveedor: proveedorActualizado };
}

export async function servicioCambiarEstadoProveedor(id: number, nuevoEstado: EstadoRegistro): Promise<{exito: boolean; mensaje: string}> {
    if (!id || id <= 0) {
        return { exito: false, mensaje: "ID de proveedor inválido." };
    }

    const actual = await buscarProveedorPorId(id);
    if (!actual) {
        return { exito: false, mensaje: "El proveedor no existe." };
    }

    await repoCambiarEstadoProveedor(id, nuevoEstado);
    const msj = nuevoEstado === EstadoRegistro.ACTIVO ? "Proveedor reactivado." : "Proveedor desactivado.";
    return { exito: true, mensaje: msj };
}
