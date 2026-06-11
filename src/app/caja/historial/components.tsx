"use client";

import { CajaTurnoCliente } from "@/modules/caja/types";

export function ListaHistorialCajas({ cajas }: { cajas: CajaTurnoCliente[] }) {
    const formatSoles = (valor: number | null | undefined) => {
        if (valor == null) return "Bs 0.00";
        return `Bs ${valor.toFixed(2)}`;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {cajas.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        <div className="font-semibold">{new Date(c.fechaApertura).toLocaleString('es-ES')}</div>
                                        <div className="text-xs text-slate-500">{c.usuarioAperturaNombre}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        {c.fechaCierre ? (
                                            <>
                                                <div className="font-semibold">{new Date(c.fechaCierre).toLocaleString('es-ES')}</div>
                                                <div className="text-xs text-slate-500">{c.usuarioCierreNombre}</div>
                                            </>
                                        ) : (
                                            <span className="text-slate-400">-</span>
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
                                            <span className="text-slate-400">-</span>
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
                                </tr>
                            ))}
                            {cajas.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No hay registros de cajas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
