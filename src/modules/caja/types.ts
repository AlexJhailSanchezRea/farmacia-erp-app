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
    creadoEn: string;
}

export interface ResumenCaja {
    totalIngresos: number;
    totalEgresos: number;
    saldoActual: number;
}
