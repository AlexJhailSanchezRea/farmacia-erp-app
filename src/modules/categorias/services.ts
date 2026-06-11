import { EstadoRegistro } from "@/generated/prisma/client";
import { 
    obtenerCategorias as repoObtenerCategorias,
    crearCategoria as repoCrearCategoria,
    actualizarCategoria as repoActualizarCategoria,
    buscarCategoriaPorNombre,
    buscarCategoriaPorId,
    cambiarEstadoCategoria as repoCambiarEstadoCategoria
} from "./repository";
import { Categoria, CrearCategoriaInput, ActualizarCategoriaInput } from "./types";
import { validarCrearCategoria, validarActualizarCategoria } from "./validations";

export async function servicioObtenerCategorias(): Promise<Categoria[]> {
    return repoObtenerCategorias();
}

export async function servicioCrearCategoria(datos: CrearCategoriaInput): Promise<{exito: boolean; mensaje: string; categoria?: Categoria}> {
    const errorValidacion = validarCrearCategoria(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const existe = await buscarCategoriaPorNombre(datos.nombre.trim());
    if (existe) {
        return { exito: false, mensaje: "Ya existe una categoría con ese nombre." };
    }

    const nuevaCategoria = await repoCrearCategoria(datos);
    return { exito: true, mensaje: "Categoría creada exitosamente.", categoria: nuevaCategoria };
}

export async function servicioActualizarCategoria(datos: ActualizarCategoriaInput): Promise<{exito: boolean; mensaje: string; categoria?: Categoria}> {
    const errorValidacion = validarActualizarCategoria(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    const actual = await buscarCategoriaPorId(datos.id);
    if (!actual) {
        return { exito: false, mensaje: "La categoría no existe." };
    }

    if (actual.nombre.toLowerCase() !== datos.nombre.trim().toLowerCase()) {
        const existe = await buscarCategoriaPorNombre(datos.nombre.trim());
        if (existe) {
            return { exito: false, mensaje: "Ya existe otra categoría con ese nombre." };
        }
    }

    const categoriaActualizada = await repoActualizarCategoria(datos);
    return { exito: true, mensaje: "Categoría actualizada exitosamente.", categoria: categoriaActualizada };
}

export async function servicioCambiarEstadoCategoria(id: number, nuevoEstado: EstadoRegistro): Promise<{exito: boolean; mensaje: string}> {
    if (!id || id <= 0) {
        return { exito: false, mensaje: "ID de categoría inválido." };
    }

    const actual = await buscarCategoriaPorId(id);
    if (!actual) {
        return { exito: false, mensaje: "La categoría no existe." };
    }

    await repoCambiarEstadoCategoria(id, nuevoEstado);
    const msj = nuevoEstado === EstadoRegistro.ACTIVO ? "Categoría reactivada." : "Categoría desactivada.";
    return { exito: true, mensaje: msj };
}
