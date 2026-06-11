import { TipoMovimientoInventario } from "@/generated/prisma/client";
import { ProductoCliente } from "@/modules/productos/types";

export interface MovimientoInventarioCliente {
    id: number;
    tipoMovimiento: TipoMovimientoInventario;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    motivo: string | null;
    referencia: string | null;
    creadoEn: string;
    productoId: number;
    compraId: number | null;
    ventaId: number | null;
    
    // Relación opcional
    producto?: ProductoCliente & {
        categoria?: { nombre: string };
    };
}
