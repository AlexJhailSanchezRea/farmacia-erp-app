import { 
    obtenerVentas as repoObtenerVentas,
    crearVentaConTransaccion,
    anularVentaConTransaccion
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

export async function servicioAnularVenta(idVenta: number, motivo: string): Promise<{exito: boolean; mensaje: string; venta?: VentaCliente}> {
    if (!motivo || motivo.trim().length === 0) {
        return { exito: false, mensaje: "El motivo de anulación es obligatorio." };
    }

    try {
        const ventaAnulada = await anularVentaConTransaccion(idVenta, motivo.trim());
        return { exito: true, mensaje: "Venta anulada correctamente. Stock devuelto y caja actualizada.", venta: ventaAnulada };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error al anular la venta.";
        return { exito: false, mensaje: msg };
    }
}
