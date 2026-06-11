import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    obtenerProductos as repoObtenerProductos,
    crearProducto as repoCrearProducto,
    actualizarProducto as repoActualizarProducto,
    buscarProductoPorNombre,
    buscarProductoPorId,
    cambiarEstadoProducto as repoCambiarEstadoProducto
} from "./repository";
import { obtenerCategorias } from "@/modules/categorias/repository";
import { ProductoCliente, CrearProductoInput, ActualizarProductoInput } from "./types";
import { validarCrearProducto, validarActualizarProducto } from "./validations";
import { Categoria } from "@/modules/categorias/types";

export async function servicioObtenerProductos(): Promise<ProductoCliente[]> {
    return repoObtenerProductos();
}

export async function servicioObtenerCategoriasActivas(): Promise<Categoria[]> {
    const categorias = await obtenerCategorias();
    return categorias.filter(c => c.estado === EstadoRegistro.ACTIVO);
}

export async function servicioCrearProducto(datos: CrearProductoInput): Promise<{exito: boolean; mensaje: string; producto?: ProductoCliente}> {
    const errorValidacion = validarCrearProducto(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const existe = await buscarProductoPorNombre(datos.nombre.trim());
    if (existe) {
        return { exito: false, mensaje: "Ya existe un producto con ese nombre." };
    }

    const nuevoProducto = await repoCrearProducto(datos);
    return { exito: true, mensaje: "Producto creado exitosamente.", producto: nuevoProducto };
}

export async function servicioActualizarProducto(datos: ActualizarProductoInput): Promise<{exito: boolean; mensaje: string; producto?: ProductoCliente}> {
    const errorValidacion = validarActualizarProducto(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const actual = await buscarProductoPorId(datos.id);
    if (!actual) {
        return { exito: false, mensaje: "El producto no existe." };
    }

    if (actual.nombre.toLowerCase() !== datos.nombre.trim().toLowerCase()) {
        const existe = await buscarProductoPorNombre(datos.nombre.trim());
        if (existe) {
            return { exito: false, mensaje: "Ya existe otro producto con ese nombre." };
        }
    }

    const productoActualizado = await repoActualizarProducto(datos);
    return { exito: true, mensaje: "Producto actualizado exitosamente.", producto: productoActualizado };
}

export async function servicioCambiarEstadoProducto(id: number, nuevoEstado: EstadoRegistro): Promise<{exito: boolean; mensaje: string}> {
    if (!id || id <= 0) {
        return { exito: false, mensaje: "ID de producto inválido." };
    }

    const actual = await buscarProductoPorId(id);
    if (!actual) {
        return { exito: false, mensaje: "El producto no existe." };
    }

    await repoCambiarEstadoProducto(id, nuevoEstado);
    const msj = nuevoEstado === EstadoRegistro.ACTIVO ? "Producto reactivado." : "Producto desactivado.";
    return { exito: true, mensaje: msj };
}
