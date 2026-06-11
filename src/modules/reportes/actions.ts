"use server";

import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { 
    servicioExportarVentas,
    servicioExportarCompras,
    servicioExportarMovimientosCaja,
    servicioExportarProductosStockBajo,
    servicioExportarLotesPorVencer
} from "./services";

async function verificarPermisoExportacion() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario) {
        throw new Error("No autenticado");
    }
    const rol = usuario.rol.nombre;
    if (rol !== "Administrador" && rol !== "Contador") {
        throw new Error("No autorizado para exportar reportes.");
    }
}

export async function accionExportarVentas() {
    try {
        await verificarPermisoExportacion();
        const datos = await servicioExportarVentas();
        return { exito: true, datos };
    } catch (error: unknown) {
        return { exito: false, mensaje: (error as Error).message };
    }
}

export async function accionExportarCompras() {
    try {
        await verificarPermisoExportacion();
        const datos = await servicioExportarCompras();
        return { exito: true, datos };
    } catch (error: unknown) {
        return { exito: false, mensaje: (error as Error).message };
    }
}

export async function accionExportarMovimientosCaja() {
    try {
        await verificarPermisoExportacion();
        const datos = await servicioExportarMovimientosCaja();
        return { exito: true, datos };
    } catch (error: unknown) {
        return { exito: false, mensaje: (error as Error).message };
    }
}

export async function accionExportarProductosStockBajo() {
    try {
        await verificarPermisoExportacion();
        const datos = await servicioExportarProductosStockBajo();
        return { exito: true, datos };
    } catch (error: unknown) {
        return { exito: false, mensaje: (error as Error).message };
    }
}

export async function accionExportarLotesPorVencer() {
    try {
        await verificarPermisoExportacion();
        const datos = await servicioExportarLotesPorVencer();
        return { exito: true, datos };
    } catch (error: unknown) {
        return { exito: false, mensaje: (error as Error).message };
    }
}
