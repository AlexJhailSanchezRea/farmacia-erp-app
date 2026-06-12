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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Alertas Sanitarias</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Panel de control farmacéutico: Vencimientos y Stock Crítico.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-2xl border border-rose-200 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-rose-600">Lotes Vencidos</p>
                        <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">{TotalVencidos}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-rose-500 bg-rose-50 px-2 py-1 inline-block rounded w-fit">
                        Requieren retiro inmediato
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-amber-600">Riesgo 30 Días</p>
                        <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">{Total30}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 inline-block rounded w-fit">
                        Lotes próximos a caducar
                    </div>
                </div>

                <div className="rounded-2xl border border-yellow-200 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-yellow-600">Riesgo 60 Días</p>
                        <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">{Total60}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 inline-block rounded w-fit">
                        Atención temprana sugerida
                    </div>
                </div>

                <div className="rounded-2xl border border-cyan-200 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-teal-600">Stock Crítico Global</p>
                        <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">{TotalBajo}</h3>
                    </div>
                    <div className="mt-4 text-xs font-medium text-teal-600 bg-cyan-50 px-2 py-1 inline-block rounded w-fit">
                        Productos por debajo del mínimo
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                    {/* Tabla Vencidos */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm">
                        <h3 className="text-lg font-semibold text-rose-600 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500"></span> Lotes Vencidos
                        </h3>
                        {TotalVencidos === 0 ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400">No hay lotes vencidos en stock.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Producto</th>
                                            <th className="px-4 py-3 font-semibold text-center">Lote</th>
                                            <th className="px-4 py-3 font-semibold text-right">Stock</th>
                                            <th className="px-4 py-3 font-semibold text-right">Venció hace</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {alertas.vencidos.map(lote => (
                                            <tr key={lote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lote.producto.nombre}</td>
                                                <td className="px-4 py-3 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-3 text-right text-rose-600 font-bold">{lote.stockActual}</td>
                                                <td className="px-4 py-3 text-right">{Math.abs(lote.diasParaVencer)} días</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tabla Stock Bajo Global */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm">
                        <h3 className="text-lg font-semibold text-teal-600 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Productos con Stock Bajo
                        </h3>
                        {TotalBajo === 0 ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400">El inventario global es saludable.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Producto</th>
                                            <th className="px-4 py-3 font-semibold text-right">Mínimo</th>
                                            <th className="px-4 py-3 font-semibold text-right">Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {alertas.stockBajoGlobal.map(prod => (
                                            <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{prod.nombre}</td>
                                                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400">{prod.stockMinimo}</td>
                                                <td className="px-4 py-3 text-right text-amber-600 font-bold">{prod.stockActual}</td>
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
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm">
                        <h3 className="text-lg font-semibold text-amber-600 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Lotes Críticos (≤ 30 Días)
                        </h3>
                        {Total30 === 0 ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400">No hay lotes próximos a caducar en este rango.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Producto</th>
                                            <th className="px-4 py-3 font-semibold text-center">Lote</th>
                                            <th className="px-4 py-3 font-semibold text-right">Vence en</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {alertas.proximos30Dias.map(lote => (
                                            <tr key={lote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lote.producto.nombre}</td>
                                                <td className="px-4 py-3 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-3 text-right text-amber-600 font-bold">{lote.diasParaVencer} días</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tabla Riesgo 60 Días */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 overflow-hidden shadow-sm">
                        <h3 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Riesgo Moderado (31-60 Días)
                        </h3>
                        {Total60 === 0 ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400">No hay lotes en este rango de vencimiento.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400 dark:text-slate-600 dark:text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Producto</th>
                                            <th className="px-4 py-3 font-semibold text-center">Lote</th>
                                            <th className="px-4 py-3 font-semibold text-right">Vence en</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {alertas.proximos60Dias.map(lote => (
                                            <tr key={lote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-800">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lote.producto.nombre}</td>
                                                <td className="px-4 py-3 text-center font-mono text-xs">{lote.numeroLote}</td>
                                                <td className="px-4 py-3 text-right text-yellow-600 font-bold">{lote.diasParaVencer} días</td>
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
