"use client";

import { MovimientoInventarioCliente } from "@/modules/inventario/types";

export function ListaMovimientos({ movimientos }: { movimientos: MovimientoInventarioCliente[] }) {
    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Movimientos de Inventario</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Historial de entradas, salidas y ajustes de stock.</p>
            </header>

            <div className="app-table-wrapper">
                <table className="app-table">
                    <thead className="app-table-head">
                        <tr>
                            <th className="app-table-cell font-semibold">Fecha</th>
                            <th className="app-table-cell font-semibold">Producto</th>
                            <th className="app-table-cell font-semibold">Tipo</th>
                            <th className="app-table-cell font-semibold text-right">Cant.</th>
                            <th className="app-table-cell font-semibold text-right">Stock Ant.</th>
                            <th className="app-table-cell font-semibold text-right">Stock Nvo.</th>
                            <th className="app-table-cell font-semibold">Motivo / Ref.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {movimientos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay movimientos de inventario registrados.
                                </td>
                            </tr>
                        ) : (
                            movimientos.map((mov) => (
                                <tr key={mov.id} className="app-table-row">
                                    <td className="app-table-cell whitespace-nowrap text-slate-600 dark:text-slate-400">
                                        {new Date(mov.creadoEn).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="app-table-cell">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {mov.producto?.nombre}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                <span>Cod: <span className="text-slate-700 dark:text-slate-300">{mov.producto?.codigoBarra}</span></span>
                                                <span>&bull;</span>
                                                <span>ID: {mov.producto?.id}</span>
                                            </div>
                                            {mov.producto?.categoria?.nombre && (
                                                <span className="inline-flex w-fit items-center rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                                                    {mov.producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="app-table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            mov.tipoMovimiento === "ENTRADA" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            mov.tipoMovimiento === "SALIDA" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            {mov.tipoMovimiento}
                                        </span>
                                    </td>
                                    <td className="app-table-cell text-right font-semibold text-slate-900 dark:text-white">
                                        {mov.tipoMovimiento === "ENTRADA" ? "+" : mov.tipoMovimiento === "SALIDA" ? "-" : ""}{mov.cantidad}
                                    </td>
                                    <td className="app-table-cell text-right text-slate-600 dark:text-slate-400">{mov.stockAnterior}</td>
                                    <td className="app-table-cell text-right font-medium text-teal-600 dark:text-teal-400">{mov.stockNuevo}</td>
                                    <td className="app-table-cell text-slate-600 dark:text-slate-400 text-xs">
                                        {mov.motivo && <div className="font-medium text-slate-700 dark:text-slate-300">{mov.motivo}</div>}
                                        {mov.referencia && <div>{mov.referencia}</div>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
