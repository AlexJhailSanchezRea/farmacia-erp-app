import { obtenerComprobantes, obtenerComprobantePorId } from "./repository";
import { ComprobanteCliente, ComprobanteDetalleCliente } from "./types";

export async function servicioObtenerComprobantes(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: ComprobanteCliente[], total: number, totalPages: number }> {
    return obtenerComprobantes(q, pagina, limite);
}

export async function servicioObtenerComprobantePorId(id: number): Promise<ComprobanteDetalleCliente | null> {
    return obtenerComprobantePorId(id);
}
