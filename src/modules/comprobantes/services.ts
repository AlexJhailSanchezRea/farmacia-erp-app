import { obtenerComprobantes } from "./repository";
import { ComprobanteCliente } from "./types";

export async function servicioObtenerComprobantes(): Promise<ComprobanteCliente[]> {
    return obtenerComprobantes();
}
