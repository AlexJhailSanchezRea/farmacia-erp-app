"use client";

import { useState, useActionState, useEffect } from "react";
import { MovimientoCajaCliente, ResumenCaja, CajaTurnoCliente } from "@/modules/caja/types";
import { registrarMovimientoAccion, abrirCajaAccion, cerrarCajaAccion } from "@/modules/caja/actions";
import Link from "next/link";

export function CajaManager({ 
    movimientos, 
    resumen, 
    cajaAbierta,
    rolUsuario
}: { 
    movimientos: MovimientoCajaCliente[], 
    resumen: ResumenCaja,
    cajaAbierta: CajaTurnoCliente | null,
    rolUsuario: string
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAperturaOpen, setIsAperturaOpen] = useState(false);
    const [isCierreOpen, setIsCierreOpen] = useState(false);

    const puedeAbrirCerrar = rolUsuario === "Administrador" || rolUsuario === "Contador";

    const formatSoles = (valor: number) => `Bs ${valor.toFixed(2)}`;

    return (
        <div className="flex flex-col gap-8">
            {/* Panel de Estado de Caja */}
            <div className={`rounded-2xl border p-6 flex flex-col md:flex-row justify-between items-center gap-4 ${cajaAbierta ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Estado de Caja: 
                        <span className={`px-3 py-1 text-sm rounded-full ${cajaAbierta ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                            {cajaAbierta ? 'ABIERTA' : 'CERRADA'}
                        </span>
                    </h2>
                    {cajaAbierta && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Abierta por: <span className="font-semibold">{cajaAbierta.usuarioAperturaNombre}</span> el {new Date(cajaAbierta.fechaApertura).toLocaleString()}
                        </p>
                    )}
                    {!cajaAbierta && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Debe abrir la caja para registrar ventas, compras y movimientos.
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <Link 
                        href="/caja/historial"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-200 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                    >
                        Ver Historial de Cajas
                    </Link>

                    {puedeAbrirCerrar && (
                        cajaAbierta ? (
                            <button
                                onClick={() => setIsCierreOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-all"
                            >
                                Cerrar Caja
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAperturaOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
                            >
                                Abrir Caja
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Tarjetas de Resumen (Solo si hay caja abierta) */}
            {cajaAbierta && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 flex flex-col gap-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Monto Inicial</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatSoles(cajaAbierta.montoInicial)}</span>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 flex flex-col gap-2">
                        <span className="text-sm font-medium text-emerald-400">Ingresos Totales</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatSoles(resumen.totalIngresos)}</span>
                    </div>
                    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 flex flex-col gap-2">
                        <span className="text-sm font-medium text-rose-400">Egresos Totales</span>
                        <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{formatSoles(resumen.totalEgresos)}</span>
                    </div>
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 flex flex-col gap-2">
                        <span className="text-sm font-medium text-indigo-400">Saldo Esperado</span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatSoles(resumen.saldoActual)}</span>
                    </div>
                </div>
            )}

            {/* Historial de Movimientos de la caja actual */}
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Movimientos del Turno Actual</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!cajaAbierta}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                    + Nuevo Movimiento Manual
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
                                            m.tipoMovimiento === 'INGRESO' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20' : 
                                            m.tipoMovimiento === 'EGRESO' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20' : 
                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20'
                                        }`}>
                                            {m.tipoMovimiento}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                        {m.concepto}
                                        {m.ventaId && <span className="ml-2 inline-flex items-center rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">#Ven-{m.ventaId}</span>}
                                        {m.compraId && <span className="ml-2 inline-flex items-center rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">#Com-{m.compraId}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {m.referencia || "-"}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${m.tipoMovimiento === 'EGRESO' || (m.tipoMovimiento === 'AJUSTE' && m.monto < 0) ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {m.tipoMovimiento === 'EGRESO' || (m.tipoMovimiento === 'AJUSTE' && m.monto < 0) ? '-' : '+'}{formatSoles(Math.abs(m.monto))}
                                    </td>
                                </tr>
                            ))}
                            {movimientos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                        No hay movimientos registrados en el turno actual.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ModalWrapper title="Nuevo Movimiento Manual" onClose={() => setIsModalOpen(false)}>
                    <MovimientoForm onClose={() => setIsModalOpen(false)} />
                </ModalWrapper>
            )}

            {isAperturaOpen && (
                <ModalWrapper title="Apertura de Caja" onClose={() => setIsAperturaOpen(false)}>
                    <AperturaCajaForm onClose={() => setIsAperturaOpen(false)} />
                </ModalWrapper>
            )}

            {isCierreOpen && cajaAbierta && (
                <ModalWrapper title="Cierre de Caja" onClose={() => setIsCierreOpen(false)}>
                    <CierreCajaForm 
                        cajaId={cajaAbierta.id} 
                        saldoEsperado={resumen.saldoActual} 
                        onClose={() => setIsCierreOpen(false)} 
                    />
                </ModalWrapper>
            )}
        </div>
    );
}

function ModalWrapper({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>
                {children}
            </div>
        </div>
    );
}

function MovimientoForm({ onClose }: { onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(registrarMovimientoAccion, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Movimiento</label>
                <select name="tipoMovimiento" required defaultValue="AJUSTE" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                    <option value="INGRESO">INGRESO EXTRA</option>
                    <option value="EGRESO">EGRESO EXTRA</option>
                    <option value="AJUSTE">AJUSTE</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Concepto</label>
                <input name="concepto" required placeholder="Ej. Pago de luz" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto (Bs)</label>
                <input name="monto" type="number" step="0.01" required placeholder="0.00" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Referencia (Opcional)</label>
                <input name="referencia" placeholder="Ej. Recibo 123" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            {state?.error && <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{state.error}</div>}
            <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
                <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">{isPending ? "Guardando..." : "Guardar"}</button>
            </div>
        </form>
    );
}

function AperturaCajaForm({ onClose }: { onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(abrirCajaAccion, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto Inicial en Efectivo (Bs) *</label>
                <input name="montoInicial" type="number" step="0.01" min="0" required defaultValue="0.00" className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observación (Opcional)</label>
                <textarea name="observacionApertura" rows={3} placeholder="Detalles sobre el dinero en caja inicial..." className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500" />
            </div>
            {state?.error && <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{state.error}</div>}
            <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
                <button type="submit" disabled={isPending} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">{isPending ? "Abriendo..." : "Abrir Caja"}</button>
            </div>
        </form>
    );
}

function CierreCajaForm({ cajaId, saldoEsperado, onClose }: { cajaId: number, saldoEsperado: number, onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(cerrarCajaAccion, null);
    const [montoContado, setMontoContado] = useState<number | "">("");

    const diferencia = montoContado === "" ? 0 : Number(montoContado) - saldoEsperado;

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="cajaId" value={cajaId} />
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Saldo Esperado en Sistema</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">Bs {saldoEsperado.toFixed(2)}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto Físico Contado (Bs) *</label>
                <input 
                    name="montoContado" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    value={montoContado}
                    onChange={(e) => setMontoContado(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Dinero real en caja..." 
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 text-lg font-semibold" 
                />
            </div>
            
            {montoContado !== "" && (
                <div className={`p-3 rounded-lg border ${diferencia === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                    Diferencia: <strong>Bs {diferencia.toFixed(2)}</strong>
                    {diferencia !== 0 && " (Justifique en observaciones)"}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observación de Cierre (Opcional)</label>
                <textarea name="observacionCierre" rows={3} placeholder="Detalles de sobrante/faltante u otros..." className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500" />
            </div>
            {state?.error && <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{state.error}</div>}
            <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
                <button type="submit" disabled={isPending || montoContado === ""} className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50">{isPending ? "Cerrando..." : "Confirmar Cierre"}</button>
            </div>
        </form>
    );
}
