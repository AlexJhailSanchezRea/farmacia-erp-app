import { obtenerMovimientosCaja, registrarMovimientoManual, calcularResumenCaja } from "./repository";
import { movimientoCajaSchema, MovimientoCajaFormValues } from "./validations";

export async function servicioObtenerHistorialCaja() {
    return await obtenerMovimientosCaja();
}

export async function servicioObtenerResumenCaja() {
    return await calcularResumenCaja();
}

export async function servicioRegistrarMovimientoManual(data: MovimientoCajaFormValues) {
    const validacion = movimientoCajaSchema.safeParse(data);
    if (!validacion.success) {
        throw new Error(validacion.error.errors[0].message);
    }

    await registrarMovimientoManual(validacion.data);
}
