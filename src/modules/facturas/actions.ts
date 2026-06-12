"use server";

import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarAccesoModulo } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { servicioObtenerFacturas, servicioGenerarFacturaDemo, servicioObtenerFacturaPorId } from "./services";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function accionObtenerFacturas(q?: string, pagina: number = 1, limite: number = 15) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        throw new Error("No autorizado");
    }
    return servicioObtenerFacturas(q, pagina, limite);
}

export async function accionGenerarFacturaDemo(ventaId: number) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        throw new Error("No autorizado");
    }

    try {
        const factura = await servicioGenerarFacturaDemo(ventaId);
        
        await accionRegistrarAuditoria({
            modulo: "Facturas",
            accion: "Generar Factura Demo",
            descripcion: `Factura ${factura.numeroFactura} generada para la venta ID ${ventaId}.`,
            entidadId: factura.id,
            entidad: "FacturaDemo"
        });

        revalidatePath("/facturas");
        revalidatePath("/ventas");
        return { exito: true, facturaId: factura.id };
    } catch (error) {
        return { exito: false, error: (error as Error).message };
    }
}

export async function accionObtenerFacturaPorId(id: number) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        throw new Error("No autorizado");
    }

    const factura = await servicioObtenerFacturaPorId(id);
    
    // Registrar auditoría de lectura
    if (factura) {
        await accionRegistrarAuditoria({
            modulo: "Facturas",
            accion: "Consultar Factura Demo",
            descripcion: `Consulta de la factura demo ${factura.numeroFactura}.`,
            entidadId: factura.id,
            entidad: "FacturaDemo"
        });
    }

    return factura;
}
