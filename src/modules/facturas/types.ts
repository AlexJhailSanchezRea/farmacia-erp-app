import { FacturaDemo, Venta, DetalleVenta, Producto, Cliente } from "@/generated/prisma/client";

export type FacturaConDetalles = FacturaDemo & {
    venta: Venta & {
        cliente: Cliente | null;
        detalles: (DetalleVenta & {
            producto: Producto;
        })[];
    };
};
