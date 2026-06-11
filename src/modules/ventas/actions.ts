"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { 
    servicioObtenerVentas,
    servicioCrearVenta
} from "./services";
import { VentaCliente, CrearVentaInput, RespuestaAccionVenta } from "./types";

export async function accionObtenerVentas(): Promise<VentaCliente[]> {
    return servicioObtenerVentas();
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
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.venta };
    } catch (error) {
        console.error("Error crítico al registrar venta:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar la venta. Por favor intente de nuevo." };
    }
}
