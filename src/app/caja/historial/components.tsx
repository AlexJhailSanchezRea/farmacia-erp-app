"use client";

import { useState } from "react";
import { CajaTurnoCliente } from "@/modules/caja/types";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function ListaHistorialCajas({ cajas, totalPages }: { cajas: CajaTurnoCliente[], totalPages: number }) {
    const formatSoles = (valor: number | null | undefined) => {
        if (valor == null) return "Bs 0.00";
        return `Bs ${valor.toFixed(2)}`;
    };

    const [cajaAImprimir, setCajaAImprimir] = useState<CajaTurnoCliente | null>(null);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <Buscador placeholder="Buscar por usuario apertura o cierre..." />
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden print:hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-900/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Apertura</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Cierre</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">M. Inicial</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">S. Esperado</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contado</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Diferencia</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider print:hidden">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {cajas.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        <div className="font-semibold">{new Date(c.fechaApertura).toLocaleString('es-ES')}</div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">{c.usuarioAperturaNombre}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        {c.fechaCierre ? (
                                            <>
                                                <div className="font-semibold">{new Date(c.fechaCierre).toLocaleString('es-ES')}</div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">{c.usuarioCierreNombre}</div>
                                            </>
                                        ) : (
                                            <span className="text-slate-600 dark:text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        {formatSoles(c.montoInicial)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                                        {c.estado === "CERRADA" ? formatSoles(c.saldoEsperado) : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                        {c.estado === "CERRADA" ? formatSoles(c.montoContado) : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        {c.estado === "CERRADA" ? (
                                            <span className={`px-2 py-1 rounded font-bold ${
                                                c.diferencia === 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                                                (c.diferencia || 0) > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                                                'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                                            }`}>
                                                {formatSoles(c.diferencia)}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600 dark:text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            c.estado === 'ABIERTA' 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                                        }`}>
                                            {c.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center print:hidden">
                                        <button 
                                            onClick={() => setCajaAImprimir(c)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
                                        >
                                            Imprimir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cajas.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
                                        No hay registros de cajas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Impresión */}
            {cajaAImprimir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static print:block">
                    <div className="bg-white dark:bg-slate-900 print:dark:bg-white border border-slate-200 dark:border-slate-800 print:border-none rounded-2xl p-8 w-full max-w-2xl shadow-2xl print:shadow-none relative print:w-full print:max-w-none">
                        <button onClick={() => setCajaAImprimir(null)} className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white print:hidden">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 print:text-black">Reporte de Caja - {cajaAImprimir.estado}</h2>
                                <p className="text-slate-600 dark:text-slate-400 print:text-gray-600">ID: {cajaAImprimir.id} | Fecha de impresión: {new Date().toLocaleString()}</p>
                            </div>
                            <button onClick={() => window.print()} className="print:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500">
                                Imprimir
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="p-4 border rounded-lg print:border-gray-300">
                                <p className="text-slate-600 dark:text-slate-400 print:text-gray-600">Apertura</p>
                                <p className="font-semibold text-slate-900 print:text-black">{new Date(cajaAImprimir.fechaApertura).toLocaleString()}</p>
                                <p className="text-slate-600 print:text-gray-800">Por: {cajaAImprimir.usuarioAperturaNombre}</p>
                                {cajaAImprimir.observacionApertura && <p className="mt-1 italic">Obs: {cajaAImprimir.observacionApertura}</p>}
                            </div>
                            <div className="p-4 border rounded-lg print:border-gray-300">
                                <p className="text-slate-600 dark:text-slate-400 print:text-gray-600">Cierre</p>
                                <p className="font-semibold text-slate-900 print:text-black">{cajaAImprimir.fechaCierre ? new Date(cajaAImprimir.fechaCierre).toLocaleString() : "No cerrada"}</p>
                                <p className="text-slate-600 print:text-gray-800">{cajaAImprimir.usuarioCierreNombre ? `Por: ${cajaAImprimir.usuarioCierreNombre}` : "-"}</p>
                                {cajaAImprimir.observacionCierre && <p className="mt-1 italic">Obs: {cajaAImprimir.observacionCierre}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-900 print:text-black">Resumen Financiero</h3>
                            <table className="w-full text-left text-sm text-slate-900 print:text-black">
                                <tbody>
                                    <tr className="border-b print:border-gray-300"><td className="py-2">Monto Inicial</td><td className="py-2 text-right">{formatSoles(cajaAImprimir.montoInicial)}</td></tr>
                                    <tr className="border-b print:border-gray-300"><td className="py-2 text-emerald-600 print:text-black">Ingresos (+)</td><td className="py-2 text-right text-emerald-600 print:text-black">{formatSoles(cajaAImprimir.ingresosVentas + cajaAImprimir.otrosIngresos)}</td></tr>
                                    <tr className="border-b print:border-gray-300"><td className="py-2 text-rose-600 print:text-black">Egresos (-)</td><td className="py-2 text-right text-rose-600 print:text-black">{formatSoles(cajaAImprimir.egresos)}</td></tr>
                                    <tr className="border-b print:border-gray-300 font-bold"><td className="py-2">Saldo Esperado en Sistema</td><td className="py-2 text-right">{formatSoles(cajaAImprimir.saldoEsperado)}</td></tr>
                                    {cajaAImprimir.estado === "CERRADA" && (
                                        <>
                                            <tr className="border-b print:border-gray-300 font-bold"><td className="py-2">Monto Físico Contado</td><td className="py-2 text-right">{formatSoles(cajaAImprimir.montoContado)}</td></tr>
                                            <tr className="font-bold"><td className="py-2">Diferencia (Sobrante/Faltante)</td><td className="py-2 text-right">{formatSoles(cajaAImprimir.diferencia)}</td></tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <Paginacion totalPages={totalPages} />
            )}
        </div>
    );
}
