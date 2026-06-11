"use server";

import { servicioObtenerComprobantes, servicioObtenerComprobantePorId } from "./services";
import { ComprobanteCliente, ComprobanteDetalleCliente } from "./types";

export async function accionObtenerComprobantes(): Promise<ComprobanteCliente[]> {
    return servicioObtenerComprobantes();
}

export async function accionObtenerComprobantePorId(id: number): Promise<ComprobanteDetalleCliente | null> {
    return servicioObtenerComprobantePorId(id);
}
