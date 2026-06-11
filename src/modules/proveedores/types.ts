import { EstadoRegistro } from "@/generated/prisma/client";

// Tipo serializado para enviar al cliente (fechas como string)
export interface ProveedorCliente {
    id: number;
    nombre: string;
    nit: string | null;
    telefono: string | null;
    direccion: string | null;
    correo: string | null;
    contacto: string | null;
    estado: EstadoRegistro;
    creadoEn: string;
    actualizadoEn: string;
}

export interface CrearProveedorInput {
    nombre: string;
    nit?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
    contacto?: string;
}

export interface ActualizarProveedorInput {
    id: number;
    nombre: string;
    nit?: string;
    telefono?: string;
    direccion?: string;
    correo?: string;
    contacto?: string;
}

export interface RespuestaAccionProveedor<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
