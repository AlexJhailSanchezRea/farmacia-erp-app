"use client";

import { useState } from "react";
import { ReporteMetricas } from "@/modules/reportes/types";
import { 
    accionExportarVentas, 
    accionExportarCompras, 
    accionExportarMovimientosCaja, 
    accionExportarProductosStockBajo, 
    accionExportarLotesPorVencer 
} from "@/modules/reportes/actions";

export function ReportesDashboard({ datos, rolUsuario }: { datos: ReporteMetricas, rolUsuario: string }) {
    const [cargandoExport, setCargandoExport] = useState(false);
    
    const formatSoles = (valor: number) => `Bs ${valor.toFixed(2)}`;

    const puedeExportar = rolUsuario === "Administrador" || rolUsuario === "Contador";

    const exportarCSV = (nombreArchivo: string, datos: Record<string, unknown>[]) => {
        if (datos.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const headers = Object.keys(datos[0]);
        const filas = datos.map(fila => 
            headers.map(header => {
                const valor = fila[header] !== null && fila[header] !== undefined ? String(fila[header]) : "";
                return `"${valor.replace(/"/g, '""')}"`;
            }).join(",")
        );

        const csvContent = [headers.join(","), ...filas].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${nombreArchivo}_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportar = async (tipo: string) => {
        setCargandoExport(true);
        try {
            let res;
            if (tipo === "ventas") res = await accionExportarVentas();
            else if (tipo === "compras") res = await accionExportarCompras();
            else if (tipo === "caja") res = await accionExportarMovimientosCaja();
            else if (tipo === "stock") res = await accionExportarProductosStockBajo();
            else if (tipo === "lotes") res = await accionExportarLotesPorVencer();

            if (res?.exito && res.datos) {
                exportarCSV(`Reporte_${tipo}`, res.datos as Record<string, unknown>[]);
            } else {
                alert(res?.mensaje || "Error al exportar");
            }
        } catch (error) {
            console.error(error);
            alert("Error al procesar la exportación");
        } finally {
            setCargandoExport(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-end gap-3 print:hidden mb-4">
                <button 
                    onClick={() => window.print()} 
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-200 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir Reporte
                </button>
                
                {puedeExportar && (
                    <div className="relative group">
                        <button disabled={cargandoExport} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 transition-all">
                            {cargandoExport ? "Exportando..." : "Exportar CSV ▼"}
                        </button>
                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-50">
                            <div className="py-1">
                                <button onClick={() => handleExportar("ventas")} className="text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700">Ventas Activas</button>
                                <button onClick={() => handleExportar("compras")} className="text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700">Compras</button>
                                <button onClick={() => handleExportar("caja")} className="text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700">Movimientos de Caja</button>
                                <button onClick={() => handleExportar("stock")} className="text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700">Productos con Stock Bajo</button>
                                <button onClick={() => handleExportar("lotes")} className="text-slate-700 dark:text-slate-300 block px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700">Lotes próximos a vencer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
                <KPICard 
                    title="Ventas del Mes" 
                    value={formatSoles(datos.resumen.ventasTotalesMes)} 
                    color="emerald" 
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} 
                />
                <KPICard 
                    title="Compras del Mes" 
                    value={formatSoles(datos.resumen.comprasTotalesMes)} 
                    color="rose" 
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />} 
                />
                <KPICard 
                    title="Saldo en Caja" 
                    value={formatSoles(datos.resumen.saldoCaja)} 
                    color="indigo" 
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />} 
                />
                <KPICard 
                    title="Alerta Stock Bajo" 
                    value={datos.resumen.productosStockBajo.toString()} 
                    color="amber" 
                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />} 
                />
            </div>

            {/* Gráficos Simples */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
                {/* Ventas vs Compras */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ventas vs Compras</h3>
                    <div className="flex flex-col gap-4 mt-2">
                        {[
                            { label: "Ventas", value: datos.resumen.ventasTotalesMes, color: "bg-emerald-500" },
                            { label: "Compras", value: datos.resumen.comprasTotalesMes, color: "bg-rose-500" }
                        ].map(item => {
                            const max = Math.max(datos.resumen.ventasTotalesMes, datos.resumen.comprasTotalesMes, 1);
                            const pct = Math.round((item.value / max) * 100);
                            return (
                                <div key={item.label} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{formatSoles(item.value)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Flujo de Caja */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Flujo de Caja</h3>
                    <div className="flex flex-col gap-4 mt-2">
                        {[
                            { label: "Ingresos", value: datos.resumen.ingresosTotales, color: "bg-emerald-500" },
                            { label: "Egresos", value: datos.resumen.egresosTotales, color: "bg-rose-500" }
                        ].map(item => {
                            const max = Math.max(datos.resumen.ingresosTotales, datos.resumen.egresosTotales, 1);
                            const pct = Math.round((item.value / max) * 100);
                            return (
                                <div key={item.label} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{formatSoles(item.value)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Productos */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top 5 Productos Vendidos</h3>
                    <div className="flex flex-col gap-3 mt-1">
                        {datos.topProductos.length > 0 ? datos.topProductos.map(p => {
                            const max = Math.max(...datos.topProductos.map(x => x.cantidad), 1);
                            const pct = Math.round((p.cantidad / max) * 100);
                            return (
                                <div key={p.nombre} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{p.nombre}</span>
                                        <span className="font-bold text-indigo-400">{p.cantidad} und.</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        }) : (
                            <span className="text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400 text-center mt-4">No hay datos de ventas aún.</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                {/* Últimas Ventas */}
                <TablaReporte 
                    titulo="Últimas Ventas" 
                    datos={datos.ultimasVentas.map(v => ({
                        id: v.id,
                        col1: v.numero,
                        col2: new Date(v.fecha).toLocaleDateString(),
                        col3: formatSoles(v.total),
                        color: "text-emerald-400"
                    }))}
                    headers={["Nro. Venta", "Fecha", "Total"]}
                />

                {/* Últimas Compras */}
                <TablaReporte 
                    titulo="Últimas Compras" 
                    datos={datos.ultimasCompras.map(c => ({
                        id: c.id,
                        col1: c.numero,
                        col2: new Date(c.fecha).toLocaleDateString(),
                        col3: formatSoles(c.total),
                        color: "text-rose-400"
                    }))}
                    headers={["Nro. Compra", "Fecha", "Total"]}
                />

                {/* Movimientos de Caja */}
                <TablaReporte 
                    titulo="Movimientos de Caja" 
                    datos={datos.ultimosMovimientosCaja.map(m => ({
                        id: m.id,
                        col1: m.concepto,
                        col2: m.tipo,
                        col3: `${m.tipo === 'EGRESO' || (m.tipo === 'AJUSTE' && m.monto < 0) ? '-' : '+'}${formatSoles(Math.abs(m.monto))}`,
                        color: m.tipo === 'EGRESO' || (m.tipo === 'AJUSTE' && m.monto < 0) ? "text-rose-400" : "text-emerald-400"
                    }))}
                    headers={["Concepto", "Tipo", "Monto"]}
                />

                {/* Movimientos de Inventario */}
                <TablaReporte 
                    titulo="Movimientos de Inventario" 
                    datos={datos.ultimosMovimientosInventario.map(m => ({
                        id: m.id,
                        col1: m.producto,
                        col2: m.tipo,
                        col3: m.cantidad.toString(),
                        color: m.tipo === 'ENTRADA' ? "text-indigo-400" : "text-amber-400"
                    }))}
                    headers={["Producto", "Tipo", "Cantidad"]}
                />
            </div>
        </div>
    );
}

function KPICard({ title, value, color, icon }: { title: string, value: string, color: string, icon: React.ReactNode }) {
    const colorClasses = {
        emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        rose: "border-rose-500/20 bg-rose-500/10 text-rose-400",
        indigo: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    }[color] || "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400";

    return (
        <div className={`rounded-2xl border p-6 flex items-center justify-between ${colorClasses}`}>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium opacity-80">{title}</span>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                </svg>
            </div>
        </div>
    );
}

function TablaReporte({ titulo, headers, datos }: { titulo: string, headers: string[], datos: { id: number, col1: string, col2: string, col3: string, color?: string }[] }) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{titulo}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="app-table-head">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className={`px-6 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider ${i === 2 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {datos.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50 dark:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900 dark:text-white">{d.col1}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{d.col2}</td>
                                <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-right ${d.color || 'text-slate-900 dark:text-white'}`}>{d.col3}</td>
                            </tr>
                        ))}
                        {datos.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
