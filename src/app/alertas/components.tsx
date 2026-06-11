"use client";

import { AlertasSanitarias } from "@/modules/alertas/types";

export function AlertasDashboard({ alertas }: { alertas: AlertasSanitarias }) {
    
    const TotalVencidos = alertas.vencidos.length;
    const Total30 = alertas.proximos30Dias.length;
    const Total60 = alertas.proximos60Dias.length;
    const TotalBajo = alertas.stockBajoGlobal.length;

    return (
        <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Alertas Sanitarias</h1>
                <p className="mt-2 text-slate-400">Panel de control farmacéutico: Vencimientos y Stock Crítico.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-rose-400">Lotes Vencidos</p>
                        <h3 className="mt-2 text-4xl font-bold text-white">{TotalVencidos}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-rose-500">
                        Requieren retiro inmediato
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-400">Riesgo 30 Días</p>
                        <h3 className="mt-2 text-4xl font-bold text-white">{Total30}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-amber-500">
                        Lotes próximos a caducar
                    </div>
                </div>

                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-yellow-400">Riesgo 60 Días</p>
                        <h3 className="mt-2 text-4xl font-bold text-white">{Total60}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-yellow-500">
                        Atención temprana sugerida
                    </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-cyan-400">Stock Crítico Global</p>
                        <h3 className="mt-2 text-4xl font-bold text-white">{TotalBajo}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-cyan-500">
                        Productos por debajo del mínimo
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                    {/* Tabla Vencidos */}
                    <div className="rounded-2xl border border-rose-500/20 bg-slate-900/60 p-6 overflow-hidden">
                        <h3 className="text-lg font-semibold text-rose-400 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500"></span> Lotes Vencidos
                        </h3>
                        {TotalVencidos === 0 ? (
                            <p className="text-sm text-slate-500">No hay lotes vencidos en stock.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-4 py-2">Producto</th>
                                            <th className="px-4 py-2 text-center">Lote</th>
                                            <th className="px-4 py-2 text-right">Stock</th>
                                            <th className="px-4 py-2 text-right">Venció hace</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {alertas.vencidos.map(lote => (
                                            <tr key={lote.id} className="bg-slate-800/20">
                                                <td className="px-4 py-2 font-medium">{lote.producto.nombre}</td>
                                                <td className="px-4 py-2 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-2 text-right text-rose-400 font-bold">{lote.stockActual}</td>
                                                <td className="px-4 py-2 text-right">{Math.abs(lote.diasParaVencer)} días</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tabla Stock Bajo Global */}
                    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 overflow-hidden">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Productos con Stock Bajo
                        </h3>
                        {TotalBajo === 0 ? (
                            <p className="text-sm text-slate-500">El inventario global es saludable.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-4 py-2">Producto</th>
                                            <th className="px-4 py-2 text-right">Mínimo</th>
                                            <th className="px-4 py-2 text-right">Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {alertas.stockBajoGlobal.map(prod => (
                                            <tr key={prod.id} className="bg-slate-800/20">
                                                <td className="px-4 py-2 font-medium">{prod.nombre}</td>
                                                <td className="px-4 py-2 text-right text-slate-500">{prod.stockMinimo}</td>
                                                <td className="px-4 py-2 text-right text-amber-400 font-bold">{prod.stockActual}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Tabla Riesgo 30 Días */}
                    <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 overflow-hidden">
                        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Lotes Críticos (≤ 30 Días)
                        </h3>
                        {Total30 === 0 ? (
                            <p className="text-sm text-slate-500">No hay lotes próximos a caducar en este rango.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-4 py-2">Producto</th>
                                            <th className="px-4 py-2 text-center">Lote</th>
                                            <th className="px-4 py-2 text-right">Vence en</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {alertas.proximos30Dias.map(lote => (
                                            <tr key={lote.id} className="bg-slate-800/20">
                                                <td className="px-4 py-2 font-medium">{lote.producto.nombre}</td>
                                                <td className="px-4 py-2 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-2 text-right text-amber-400 font-bold">{lote.diasParaVencer} días</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tabla Riesgo 60 Días */}
                    <div className="rounded-2xl border border-yellow-500/20 bg-slate-900/60 p-6 overflow-hidden">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Riesgo Moderado (31-60 Días)
                        </h3>
                        {Total60 === 0 ? (
                            <p className="text-sm text-slate-500">No hay lotes en este rango de vencimiento.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-4 py-2">Producto</th>
                                            <th className="px-4 py-2 text-center">Lote</th>
                                            <th className="px-4 py-2 text-right">Vence en</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {alertas.proximos60Dias.map(lote => (
                                            <tr key={lote.id} className="bg-slate-800/20">
                                                <td className="px-4 py-2 font-medium">{lote.producto.nombre}</td>
                                                <td className="px-4 py-2 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-2 text-right text-yellow-400 font-bold">{lote.diasParaVencer} días</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
