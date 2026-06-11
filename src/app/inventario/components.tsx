"use client";

import { MovimientoInventarioCliente } from "@/modules/inventario/types";

export function ListaMovimientos({ movimientos }: { movimientos: MovimientoInventarioCliente[] }) {
    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Movimientos de Inventario</h1>
                <p className="mt-2 text-slate-400">Historial de entradas, salidas y ajustes de stock.</p>
            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 min-w-[900px]">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Producto</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-right">Cant.</th>
                            <th className="px-6 py-4 font-semibold text-right">Stock Ant.</th>
                            <th className="px-6 py-4 font-semibold text-right">Stock Nvo.</th>
                            <th className="px-6 py-4 font-semibold">Motivo / Ref.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {movimientos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                    No hay movimientos de inventario registrados.
                                </td>
                            </tr>
                        ) : (
                            movimientos.map((mov) => (
                                <tr key={mov.id} className="hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                        {new Date(mov.creadoEn).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-white">
                                                {mov.producto?.nombre}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>Cod: <span className="text-slate-300">{mov.producto?.codigoBarra}</span></span>
                                                <span>&bull;</span>
                                                <span>ID: {mov.producto?.id}</span>
                                            </div>
                                            {mov.producto?.categoria?.nombre && (
                                                <span className="inline-flex w-fit items-center rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                                                    {mov.producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            mov.tipoMovimiento === "ENTRADA" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            mov.tipoMovimiento === "SALIDA" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            {mov.tipoMovimiento}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-white">
                                        {mov.tipoMovimiento === "ENTRADA" ? "+" : mov.tipoMovimiento === "SALIDA" ? "-" : ""}{mov.cantidad}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400">{mov.stockAnterior}</td>
                                    <td className="px-6 py-4 text-right font-medium text-cyan-400">{mov.stockNuevo}</td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {mov.motivo && <div className="font-medium text-slate-300">{mov.motivo}</div>}
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
