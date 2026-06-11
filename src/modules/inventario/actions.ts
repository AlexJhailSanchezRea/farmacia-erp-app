"use server";

import { servicioObtenerMovimientos } from "./services";
import { MovimientoInventarioCliente } from "./types";

export async function accionObtenerMovimientos(): Promise<MovimientoInventarioCliente[]> {
    return servicioObtenerMovimientos();
}
