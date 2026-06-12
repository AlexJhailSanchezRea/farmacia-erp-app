"use client";

import Link from "next/link";
import { ComprobanteCliente } from "@/modules/comprobantes/types";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function ListaComprobantes({ comprobantes, totalPages }: { comprobantes: ComprobanteCliente[], totalPages: number }) {
    return (
        <div className="flex-1 p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Comprobantes Internos</h1>
                    <p className="mt-2 text-slate-600">Historial de notas de venta emitidas.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Buscador placeholder="Buscar por nro. o cliente..." />
                </div>
            </header>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 min-w-[900px]">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-600 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nro. Comprobante</th>
                            <th className="px-6 py-4 font-semibold">Fecha Emisión</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                            <th className="px-6 py-4 font-semibold text-center">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {comprobantes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay comprobantes emitidos.
                                </td>
                            </tr>
                        ) : (
                            comprobantes.map((comp) => (
                                <tr key={comp.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-mono text-teal-600 font-medium">
                                        {comp.numeroComprobante}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(comp.fechaEmision).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {comp.clienteNombre}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {comp.tipoComprobante.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                        Bs {comp.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                            comp.estado === 'INACTIVO' 
                                                ? 'bg-red-50 text-red-700 border-red-200' 
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {comp.estado === 'INACTIVO' ? 'ANULADO' : 'VÁLIDO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link 
                                            href={`/comprobantes/${comp.id}`}
                                            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                                        >
                                            Ver comprobante
                                        </Link>
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
