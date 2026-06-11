"use server";

import { servicioObtenerComprobantes } from "./services";
import { ComprobanteCliente } from "./types";

export async function accionObtenerComprobantes(): Promise<ComprobanteCliente[]> {
    return servicioObtenerComprobantes();
}
