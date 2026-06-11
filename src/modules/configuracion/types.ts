export interface ConfiguracionSistema {
    id: number;
    nombreComercial: string;
    razonSocial: string;
    nit: string;
    direccion: string;
    telefono: string;
    correo: string | null;
    ciudad: string;
    mensajeComprobante: string;
    actualizadoEn: string;
}

export interface ConfiguracionUpdateData {
    nombreComercial: string;
    razonSocial: string;
    nit: string;
    direccion: string;
    telefono: string;
    correo?: string | null;
    ciudad: string;
    mensajeComprobante: string;
}
