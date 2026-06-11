"use client";

import { ReporteMetricas } from "@/modules/reportes/types";

export function ReportesDashboard({ datos }: { datos: ReporteMetricas }) {
    const formatSoles = (valor: number) => `Bs ${valor.toFixed(2)}`;

    return (
        <div className="flex flex-col gap-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    }[color] || "border-slate-500/20 bg-slate-500/10 text-slate-400";

    return (
        <div className={`rounded-2xl border p-6 flex items-center justify-between ${colorClasses}`}>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium opacity-80">{title}</span>
                <span className="text-3xl font-bold text-white">{value}</span>
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{titulo}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-900/40">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className={`px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider ${i === 2 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {datos.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-white">{d.col1}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-400">{d.col2}</td>
                                <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-right ${d.color || 'text-white'}`}>{d.col3}</td>
                            </tr>
                        ))}
                        {datos.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
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
