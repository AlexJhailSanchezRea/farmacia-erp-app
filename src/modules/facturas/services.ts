import { repositoryObtenerFacturas, repositoryObtenerFacturaPorId, repositoryObtenerFacturaPorVentaId, repositoryCrearFacturaDemo, repositoryObtenerUltimoNumeroFactura } from "./repository";
import { FacturaConDetalles } from "./types";
import { FacturaDemo } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function servicioObtenerFacturas(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: FacturaConDetalles[], total: number, totalPages: number }> {
    return repositoryObtenerFacturas(q, pagina, limite);
}

export async function servicioObtenerFacturaPorId(id: number): Promise<FacturaConDetalles | null> {
    return repositoryObtenerFacturaPorId(id);
}

export async function servicioGenerarFacturaDemo(ventaId: number): Promise<FacturaDemo> {
    // Verificar si ya existe
    const existe = await repositoryObtenerFacturaPorVentaId(ventaId);
    if (existe) {
        return existe;
    }

    // Obtener la venta para saber el total
    const venta = await prisma.venta.findUnique({ where: { id: ventaId }});
    if (!venta) {
        throw new Error("La venta no existe.");
    }

    const ultimoNro = await repositoryObtenerUltimoNumeroFactura();
    const numeroFactura = `F-${String(ultimoNro + 1).padStart(6, '0')}`;

    const factura = await repositoryCrearFacturaDemo(ventaId, numeroFactura, Number(venta.total));
    
    // El registro de auditoría lo delegamos al action para tener el usuario,
    // O lo podemos hacer si pasamos el user, pero el action es mejor.
    return factura;
}
