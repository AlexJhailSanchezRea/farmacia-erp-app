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

export interface DetalleVentaImpresion {
    id: number;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface ComprobanteDetalleCliente extends ComprobanteCliente {
    detalles: DetalleVentaImpresion[];
}
