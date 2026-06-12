"use client";

import { FacturaConDetalles } from "@/modules/facturas/types";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function ListaFacturas({ 
    facturas,
    totalPages
}: { 
    facturas: FacturaConDetalles[];
    totalPages: number;
}) {
    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Facturas Demo
                        <span className="bg-indigo-500/10 text-indigo-500 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-500/20">MODO DEMO</span>
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Listado de facturas generadas. No tienen validez fiscal.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Buscador placeholder="Buscar por nro. factura o cliente..." />
                </div>
            </header>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[900px]">
                    <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-600 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nro. Factura</th>
                            <th className="px-6 py-4 font-semibold">Fecha Emisión</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">NIT/CI</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                            <th className="px-6 py-4 font-semibold text-center">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {facturas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    No hay facturas demo emitidas.
                                </td>
                            </tr>
                        ) : (
                            facturas.map((f) => (
                                <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">
                                        {f.numeroFactura}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(f.fechaEmision).toLocaleString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {f.venta.cliente ? (f.venta.cliente.nombre) : "Cliente General"}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                                        {f.venta.cliente?.ciNit || "No registrado"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                                        Bs {Number(f.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            f.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {f.estado === "ACTIVO" ? "EMITIDA" : "ANULADA"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <a 
                                            href={`/facturas/${f.id}`} 
                                            className="inline-block rounded-lg bg-teal-600/20 px-4 py-2 text-xs font-medium text-teal-400 hover:bg-teal-600/40 border border-teal-500/30 transition"
                                        >
                                            Ver / Imprimir
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Paginacion totalPages={totalPages} />
            )}
        </div>
    );
}
