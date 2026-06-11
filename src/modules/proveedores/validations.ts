import { CrearProveedorInput, ActualizarProveedorInput } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCrearProveedor(datos: CrearProveedorInput): string | null {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del proveedor es obligatorio y debe tener al menos 2 caracteres.";
    }
    
    if (datos.correo && datos.correo.trim().length > 0) {
        if (!emailRegex.test(datos.correo.trim())) {
            return "El correo electrónico no tiene un formato válido.";
        }
    }

    return null;
}

export function validarActualizarProveedor(datos: ActualizarProveedorInput): string | null {
    if (!datos.id || datos.id <= 0) return "ID de proveedor inválido.";
    
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del proveedor es obligatorio y debe tener al menos 2 caracteres.";
    }
    
    if (datos.correo && datos.correo.trim().length > 0) {
        if (!emailRegex.test(datos.correo.trim())) {
            return "El correo electrónico no tiene un formato válido.";
        }
    }

    return null;
}
