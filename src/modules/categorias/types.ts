import { EstadoRegistro } from "@/generated/prisma/client";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    estado: EstadoRegistro;
    creadoEn: Date;
    actualizadoEn: Date;
}

export interface CrearCategoriaInput {
    nombre: string;
    descripcion?: string;
}

export interface ActualizarCategoriaInput {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface RespuestaAccion<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
