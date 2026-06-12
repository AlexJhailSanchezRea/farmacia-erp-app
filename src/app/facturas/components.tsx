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

            <div className="app-table-wrapper">
                <table className="app-table">
                    <thead className="app-table-head">
                        <tr>
                            <th className="app-table-cell font-semibold">Nro. Factura</th>
                            <th className="app-table-cell font-semibold">Fecha Emisión</th>
                            <th className="app-table-cell font-semibold">Cliente</th>
                            <th className="app-table-cell font-semibold">NIT/CI</th>
                            <th className="app-table-cell font-semibold text-right">Total</th>
                            <th className="app-table-cell font-semibold text-center">Estado</th>
                            <th className="app-table-cell font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {facturas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-600 dark:text-slate-400">
                                    No hay facturas demo emitidas.
                                </td>
                            </tr>
                        ) : (
                            facturas.map((f) => (
                                <tr key={f.id} className="app-table-row">
                                    <td className="app-table-cell font-mono text-indigo-400 font-medium">
                                        {f.numeroFactura}
                                    </td>
                                    <td className="app-table-cell">
                                        {new Date(f.fechaEmision).toLocaleString('es-ES')}
                                    </td>
                                    <td className="app-table-cell font-medium text-slate-900 dark:text-white">
                                        {f.venta.cliente ? (f.venta.cliente.nombre) : "Cliente General"}
                                    </td>
                                    <td className="app-table-cell font-medium text-slate-600 dark:text-slate-400">
                                        {f.venta.cliente?.ciNit || "No registrado"}
                                    </td>
                                    <td className="app-table-cell text-right font-semibold text-emerald-400">
                                        Bs {Number(f.total).toFixed(2)}
                                    </td>
                                    <td className="app-table-cell text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            f.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {f.estado === "ACTIVO" ? "EMITIDA" : "ANULADA"}
                                        </span>
                                    </td>
                                    <td className="app-table-cell text-center">
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
