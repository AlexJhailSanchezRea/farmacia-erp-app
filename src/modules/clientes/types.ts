import { EstadoRegistro } from "@/generated/prisma/client";

// Tipo serializado para enviar al cliente (fechas como string)
export interface ClienteCliente {
    id: number;
    nombre: string;
    ciNit: string | null;
    telefono: string | null;
    direccion: string | null;
    correo: string | null;
    estado: EstadoRegistro;
    creadoEn: string;
    actualizadoEn: string;
}

export interface CrearClienteInput {
    nombre: string;
    ciNit?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
}

export interface ActualizarClienteInput {
    id: number;
    nombre: string;
    ciNit?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
}

export interface RespuestaAccionCliente<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
