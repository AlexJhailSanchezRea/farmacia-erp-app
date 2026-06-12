"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { 
    servicioObtenerVentas,
    servicioCrearVenta,
    servicioAnularVenta
} from "./services";
import { VentaCliente, CrearVentaInput, RespuestaAccionVenta } from "./types";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function accionObtenerVentas(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: VentaCliente[], total: number, totalPages: number }> {
    return servicioObtenerVentas(q, pagina, limite);
}

export async function accionCrearVenta(datos: CrearVentaInput): Promise<RespuestaAccionVenta<VentaCliente>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_venta")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearVenta(datos);
        if (resultado.exito) {
            revalidatePath("/ventas");
            revalidatePath("/inventario");
            revalidatePath("/productos");
            revalidatePath("/comprobantes");
            await accionRegistrarAuditoria({
                modulo: "Ventas",
                accion: "Registrar",
                descripcion: `Venta registrada (Cliente ID: ${datos.clienteId})`,
                entidadId: resultado.venta?.id,
                entidad: "Venta"
            });
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.venta };
    } catch (error) {
        console.error("Error crítico al registrar venta:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar la venta. Por favor intente de nuevo." };
    }
}

export async function accionAnularVenta(idVenta: number, motivo: string): Promise<RespuestaAccionVenta<VentaCliente>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "anular_venta")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    
    try {
        const resultado = await servicioAnularVenta(idVenta, motivo);
        if (resultado.exito && resultado.venta) {
            revalidatePath("/ventas");
            revalidatePath("/inventario");
            revalidatePath("/productos");
            revalidatePath("/comprobantes");
            revalidatePath("/caja");
            revalidatePath("/reportes");
            
            await accionRegistrarAuditoria({
                modulo: "Ventas",
                accion: "Anular",
                descripcion: `Venta anulada (Nro: ${resultado.venta.numeroVenta}). Motivo: ${motivo}`,
                entidadId: resultado.venta.id,
                entidad: "Venta"
            });
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.venta };
    } catch (error) {
        console.error("Error crítico al anular venta:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al anular la venta. Por favor intente de nuevo." };
    }
}
