import { CrearCategoriaInput, ActualizarCategoriaInput } from "./types";

export function validarCrearCategoria(datos: CrearCategoriaInput): string | null {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre de la categoría es obligatorio y debe tener al menos 2 caracteres.";
    }
    return null;
}

export function validarActualizarCategoria(datos: ActualizarCategoriaInput): string | null {
    if (!datos.id || datos.id <= 0) {
        return "ID de categoría inválido.";
    }
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre de la categoría es obligatorio y debe tener al menos 2 caracteres.";
    }
    return null;
}
