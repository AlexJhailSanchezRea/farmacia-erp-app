import { 
    obtenerVentas as repoObtenerVentas,
    crearVentaConTransaccion
} from "./repository";
import { VentaCliente, CrearVentaInput } from "./types";
import { validarCrearVenta } from "./validations";

export async function servicioObtenerVentas(): Promise<VentaCliente[]> {
    return repoObtenerVentas();
}

export async function servicioCrearVenta(datos: CrearVentaInput): Promise<{exito: boolean; mensaje: string; venta?: VentaCliente}> {
    const errorValidacion = validarCrearVenta(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    try {
        const nuevaVenta = await crearVentaConTransaccion(datos);
        return { exito: true, mensaje: "Venta registrada, stock descontado y comprobante generado exitosamente.", venta: nuevaVenta };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error al procesar la venta.";
        return { exito: false, mensaje: msg };
    }
}
