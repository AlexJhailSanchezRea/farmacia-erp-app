import { EstadoRegistro } from "@/generated/prisma/client";
import { ProveedorCliente } from "@/modules/proveedores/types";
import { ProductoCliente } from "@/modules/productos/types";

export interface DetalleCompraCliente {
    id: number;
    compraId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    
    producto?: ProductoCliente;
}

export interface CompraCliente {
    id: number;
    numeroCompra: string;
    fechaCompra: string;
    total: number;
    observacion: string | null;
    estado: EstadoRegistro;
    proveedorId: number;
    creadoEn: string;
    
    proveedor?: ProveedorCliente;
    detalles?: DetalleCompraCliente[];
}

export interface DetalleCompraInput {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    numeroLote: string;
    fechaVencimiento: string;
}

export interface CrearCompraInput {
    proveedorId: number;
    observacion?: string;
    detalles: DetalleCompraInput[];
}

export interface RespuestaAccionCompra<T = void> {
    exito: boolean;
    mensaje: string;
    datos?: T;
}
