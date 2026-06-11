import { obtenerMovimientosInventario } from "./repository";
import { MovimientoInventarioCliente } from "./types";

export async function servicioObtenerMovimientos(): Promise<MovimientoInventarioCliente[]> {
    return obtenerMovimientosInventario();
}
