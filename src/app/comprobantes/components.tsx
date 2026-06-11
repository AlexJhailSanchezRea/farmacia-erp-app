"use client";

import { ComprobanteCliente } from "@/modules/comprobantes/types";

export function ListaComprobantes({ comprobantes }: { comprobantes: ComprobanteCliente[] }) {
    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Comprobantes Internos</h1>
                <p className="mt-2 text-slate-400">Historial de notas de venta emitidas.</p>
            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 min-w-[900px]">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nro. Comprobante</th>
                            <th className="px-6 py-4 font-semibold">Fecha Emisión</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                            <th className="px-6 py-4 font-semibold text-center">Ref. Venta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {comprobantes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No hay comprobantes emitidos.
                                </td>
                            </tr>
                        ) : (
                            comprobantes.map((comp) => (
                                <tr key={comp.id} className="hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-mono text-cyan-400 font-medium">
                                        {comp.numeroComprobante}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">
                                        {new Date(comp.fechaEmision).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {comp.clienteNombre}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {comp.tipoComprobante.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                        Bs {comp.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500 text-xs">
                                        ID {comp.ventaId}
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
