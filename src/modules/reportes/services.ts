import { 
    obtenerReporteGeneral,
    exportarVentasDB,
    exportarComprasDB,
    exportarMovimientosCajaDB,
    exportarProductosStockBajoDB,
    exportarLotesPorVencerDB
} from "./repository";

export async function servicioObtenerReporteGeneral() {
    return await obtenerReporteGeneral();
}

export async function servicioExportarVentas() {
    return await exportarVentasDB();
}

export async function servicioExportarCompras() {
    return await exportarComprasDB();
}

export async function servicioExportarMovimientosCaja() {
    return await exportarMovimientosCajaDB();
}

export async function servicioExportarProductosStockBajo() {
    return await exportarProductosStockBajoDB();
}

export async function servicioExportarLotesPorVencer() {
    return await exportarLotesPorVencerDB();
}
