import { EstadoRegistro, TipoComprobante } from "@/generated/prisma/client";

export interface ComprobanteCliente {
    id: number;
    numeroComprobante: string;
    tipoComprobante: TipoComprobante;
    fechaEmision: string;
    total: number;
    clienteNombre: string;
    estado: EstadoRegistro;
    ventaId: number;
    creadoEn: string;
}
