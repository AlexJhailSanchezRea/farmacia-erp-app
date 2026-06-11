"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { 
    servicioObtenerCompras,
    servicioCrearCompra
} from "./services";
import { CompraCliente, CrearCompraInput, RespuestaAccionCompra } from "./types";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function accionObtenerCompras(): Promise<CompraCliente[]> {
    return servicioObtenerCompras();
}

export async function accionCrearCompra(datos: CrearCompraInput): Promise<RespuestaAccionCompra<CompraCliente>> {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_compra")) {
        return { exito: false, mensaje: "No tienes permisos para realizar esta acción." };
    }
    try {
        const resultado = await servicioCrearCompra(datos);
        if (resultado.exito) {
            revalidatePath("/compras");
            revalidatePath("/inventario");
            revalidatePath("/productos");
            await accionRegistrarAuditoria({
                modulo: "Compras",
                accion: "Registrar",
                descripcion: `Compra registrada (Nro: ${resultado.compra?.numeroCompra})`,
                entidadId: resultado.compra?.id,
                entidad: "Compra"
            });
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.compra };
    } catch (error) {
        console.error("Error al registrar compra:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar la compra. Asegúrese de que los datos sean válidos." };
    }
}
