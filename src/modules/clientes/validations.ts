import { CrearClienteInput, ActualizarClienteInput } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCrearCliente(datos: CrearClienteInput): string | null {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del cliente es obligatorio y debe tener al menos 2 caracteres.";
    }
    
    if (datos.correo && datos.correo.trim().length > 0) {
        if (!emailRegex.test(datos.correo.trim())) {
            return "El correo electrónico no tiene un formato válido.";
        }
    }

    return null;
}

export function validarActualizarCliente(datos: ActualizarClienteInput): string | null {
    if (!datos.id || datos.id <= 0) return "ID de cliente inválido.";
    
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del cliente es obligatorio y debe tener al menos 2 caracteres.";
    }
    
    if (datos.correo && datos.correo.trim().length > 0) {
        if (!emailRegex.test(datos.correo.trim())) {
            return "El correo electrónico no tiene un formato válido.";
        }
    }

    return null;
}
