import { obtenerComprobantes, obtenerComprobantePorId } from "./repository";
import { ComprobanteCliente, ComprobanteDetalleCliente } from "./types";

export async function servicioObtenerComprobantes(): Promise<ComprobanteCliente[]> {
    return obtenerComprobantes();
}

export async function servicioObtenerComprobantePorId(id: number): Promise<ComprobanteDetalleCliente | null> {
    return obtenerComprobantePorId(id);
}
