export interface MovimientoCajaCliente {
    id: number;
    tipoMovimiento: "INGRESO" | "EGRESO" | "AJUSTE";
    concepto: string;
    monto: number;
    fechaMovimiento: string;
    referencia: string | null;
    estado: string;
    ventaId: number | null;
    compraId: number | null;
    cajaTurnoId: number | null;
    creadoEn: string;
}

export interface ResumenCaja {
    totalIngresos: number;
    totalEgresos: number;
    saldoActual: number;
}

export interface CajaTurnoCliente {
    id: number;
    fechaApertura: string;
    fechaCierre: string | null;
    montoInicial: number;
    ingresosVentas: number;
    otrosIngresos: number;
    egresos: number;
    saldoEsperado: number;
    montoContado: number | null;
    diferencia: number | null;
    observacionApertura: string | null;
    observacionCierre: string | null;
    estado: "ABIERTA" | "CERRADA";
    usuarioAperturaNombre: string;
    usuarioCierreNombre: string | null;
}
