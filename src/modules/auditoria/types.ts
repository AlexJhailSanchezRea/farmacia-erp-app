export interface AuditoriaRegistro {
    id: number;
    usuarioId: number | null;
    usuarioCorreo: string | null;
    modulo: string;
    accion: string;
    descripcion: string;
    entidadId: number | null;
    entidad: string | null;
    ip: string | null;
    userAgent: string | null;
    creadoEn: string;
}

export interface CrearAuditoriaData {
    modulo: string;
    accion: string;
    descripcion: string;
    entidadId?: number | null;
    entidad?: string | null;
}
