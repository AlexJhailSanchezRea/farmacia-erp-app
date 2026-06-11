import { 
    obtenerMovimientosCaja, 
    registrarMovimientoManual, 
    calcularResumenCaja,
    repositoryObtenerCajaAbierta,
    repositoryAbrirCaja,
    repositoryCerrarCaja,
    repositoryObtenerHistorialCajas
} from "./repository";
import { movimientoCajaSchema, MovimientoCajaFormValues } from "./validations";

export async function servicioObtenerCajaAbierta() {
    return await repositoryObtenerCajaAbierta();
}

export async function servicioAbrirCaja(usuarioId: number, montoInicial: number, observacion?: string) {
    if (montoInicial < 0) throw new Error("El monto inicial no puede ser negativo");
    return await repositoryAbrirCaja({ usuarioId, montoInicial, observacion });
}

export async function servicioCerrarCaja(cajaId: number, usuarioId: number, montoContado: number, observacion?: string) {
    if (montoContado < 0) throw new Error("El monto contado no puede ser negativo");
    return await repositoryCerrarCaja({ cajaId, usuarioId, montoContado, observacion });
}

export async function servicioObtenerHistorialCajas() {
    return await repositoryObtenerHistorialCajas();
}

export async function servicioObtenerHistorialMovimientos() {
    return await obtenerMovimientosCaja();
}

export async function servicioObtenerResumenCaja() {
    return await calcularResumenCaja();
}

export async function servicioRegistrarMovimientoManual(data: MovimientoCajaFormValues) {
    const validacion = movimientoCajaSchema.safeParse(data);
    if (!validacion.success) {
        throw new Error(validacion.error.issues[0].message);
    }

    return await registrarMovimientoManual(validacion.data);
}
