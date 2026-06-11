"use client";

import { useState, useActionState, useEffect } from "react";
import { MovimientoCajaCliente, ResumenCaja } from "@/modules/caja/types";
import { registrarMovimientoAccion } from "@/modules/caja/actions";

export function CajaManager({ movimientos, resumen }: { movimientos: MovimientoCajaCliente[], resumen: ResumenCaja }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCrear = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const formatSoles = (valor: number) => {
        return `Bs ${valor.toFixed(2)}`;
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 flex flex-col gap-2">
                    <span className="text-sm font-medium text-emerald-400">Total Ingresos</span>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatSoles(resumen.totalIngresos)}</span>
                </div>
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 flex flex-col gap-2">
                    <span className="text-sm font-medium text-rose-400">Total Egresos</span>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatSoles(resumen.totalEgresos)}</span>
                </div>
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 flex flex-col gap-2">
                    <span className="text-sm font-medium text-indigo-400">Saldo en Caja</span>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatSoles(resumen.saldoActual)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Historial de Movimientos</h2>
                <button
                    onClick={handleCrear}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Ajuste
                </button>
            </div>

            {/* Tabla de Movimientos */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-white dark:bg-slate-900/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Concepto</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Referencia</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {movimientos.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50 dark:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                        {new Date(m.fechaMovimiento).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            m.tipoMovimiento === 'INGRESO' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20' : 
                                            m.tipoMovimiento === 'EGRESO' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' : 
                                            'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20'
                                        }`}>
                                            {m.tipoMovimiento}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                        {m.concepto}
                                        {m.ventaId && <span className="ml-2 inline-flex items-center rounded bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">#Ven-{m.ventaId}</span>}
                                        {m.compraId && <span className="ml-2 inline-flex items-center rounded bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">#Com-{m.compraId}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {m.referencia || "-"}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${m.tipoMovimiento === 'EGRESO' || (m.tipoMovimiento === 'AJUSTE' && m.monto < 0) ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {m.tipoMovimiento === 'EGRESO' || (m.tipoMovimiento === 'AJUSTE' && m.monto < 0) ? '-' : '+'}{formatSoles(Math.abs(m.monto))}
                                    </td>
                                </tr>
                            ))}
                            {movimientos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                        No hay movimientos registrados en caja.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de formulario */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Nuevo Movimiento Manual</h3>
                        <MovimientoForm onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}

function MovimientoForm({ onClose }: { onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(registrarMovimientoAccion, null);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Movimiento</label>
                <select 
                    name="tipoMovimiento" 
                    required
                    defaultValue="AJUSTE"
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&>option]:bg-slate-50 dark:bg-slate-800"
                >
                    <option value="INGRESO">INGRESO EXTRA</option>
                    <option value="EGRESO">EGRESO EXTRA</option>
                    <option value="AJUSTE">AJUSTE</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Concepto</label>
                <input 
                    name="concepto" 
                    required 
                    placeholder="Ej. Pago de luz, Aporte socio..."
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 dark:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto (Bs)</label>
                <input 
                    name="monto" 
                    type="number"
                    step="0.01"
                    required 
                    placeholder="0.00"
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 dark:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Referencia (Opcional)</label>
                <input 
                    name="referencia" 
                    placeholder="Ej. Recibo 123"
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 dark:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>

            {state?.error && (
                <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    {state.error}
                </div>
            )}

            <div className="mt-4 flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-800 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    );
}
