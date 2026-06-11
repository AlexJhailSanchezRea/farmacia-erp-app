"use server";

import { revalidatePath } from "next/cache";
import { 
    servicioObtenerCompras,
    servicioCrearCompra
} from "./services";
import { CompraCliente, CrearCompraInput, RespuestaAccionCompra } from "./types";

export async function accionObtenerCompras(): Promise<CompraCliente[]> {
    return servicioObtenerCompras();
}

export async function accionCrearCompra(datos: CrearCompraInput): Promise<RespuestaAccionCompra<CompraCliente>> {
    try {
        const resultado = await servicioCrearCompra(datos);
        if (resultado.exito) {
            revalidatePath("/compras");
            revalidatePath("/inventario");
            revalidatePath("/productos");
        }
        return { exito: resultado.exito, mensaje: resultado.mensaje, datos: resultado.compra };
    } catch (error) {
        console.error("Error al registrar compra:", error);
        return { exito: false, mensaje: "Ocurrió un error interno al registrar la compra. Asegúrese de que los datos sean válidos." };
    }
}
