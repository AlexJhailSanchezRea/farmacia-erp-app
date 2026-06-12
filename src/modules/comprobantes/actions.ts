"use server";

import { servicioObtenerComprobantes, servicioObtenerComprobantePorId } from "./services";
import { ComprobanteCliente, ComprobanteDetalleCliente } from "./types";

export async function accionObtenerComprobantes(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: ComprobanteCliente[], total: number, totalPages: number }> {
    return servicioObtenerComprobantes(q, pagina, limite);
}

export async function accionObtenerComprobantePorId(id: number): Promise<ComprobanteDetalleCliente | null> {
    return servicioObtenerComprobantePorId(id);
}
