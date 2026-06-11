import { EstadoRegistro } from "@/generated/prisma/client";
import { ClienteCliente } from "@/modules/clientes/types";
import { ProductoCliente } from "@/modules/productos/types";

export interface DetalleVentaCliente {
    id: number;
    ventaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    
    producto?: ProductoCliente;
}

export interface VentaCliente {
    id: number;
    numeroVenta: string;
    fechaVenta: string;
    total: number;
    observacion: string | null;
    estado: EstadoRegistro;
    clienteId: number | null;
    creadoEn: string;
    
    cliente?: ClienteCliente | null;
    detalles?: DetalleVentaCliente[];
}

export interface DetalleVentaInput {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface CrearVentaInput {
    clienteId?: number; // Opcional, puede ser null
    observacion?: string;
    detalles: DetalleVentaInput[];
}

export interface RespuestaAccionVenta<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
