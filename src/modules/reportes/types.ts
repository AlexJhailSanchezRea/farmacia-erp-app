export interface DashboardResumen {
    ventasTotalesMes: number;
    comprasTotalesMes: number;
    saldoCaja: number;
    productosActivos: number;
    productosStockBajo: number;
    movimientosEntradaMes: number;
    movimientosSalidaMes: number;
}

export interface ReporteMetricas {
    resumen: DashboardResumen;
    ultimasVentas: { id: number, numero: string, total: number, fecha: string }[];
    ultimasCompras: { id: number, numero: string, total: number, fecha: string }[];
    ultimosMovimientosInventario: { id: number, tipo: string, producto: string, cantidad: number, fecha: string }[];
    ultimosMovimientosCaja: { id: number, tipo: string, concepto: string, monto: number, fecha: string }[];
}
