/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { cambiarContrasenaAccion } from "@/modules/usuarios/actions";

export function CambiarContrasenaForm() {
    const [state, formAction, isPending] = useActionState(cambiarContrasenaAccion, null);
    const formRef = useRef<HTMLFormElement>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    useEffect(() => {
        if (state?.success) {
            setMensajeExito(state.mensaje || "Contraseña actualizada exitosamente.");
            formRef.current?.reset();
            
            // Ocultar mensaje después de 5 segundos
            const timer = setTimeout(() => {
                setMensajeExito(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            {state?.error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
                    {state.error}
                </div>
            )}
            
            {mensajeExito && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl">
                    {mensajeExito}
                    <p className="text-xs mt-1">Todas las demás sesiones activas han sido cerradas por seguridad.</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contraseña Actual
                </label>
                <input 
                    type="password" 
                    name="actual" 
                    required 
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nueva Contraseña
                </label>
                <input 
                    type="password" 
                    name="nueva" 
                    required 
                    minLength={8}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    placeholder="Mínimo 8 caracteres"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirmar Nueva Contraseña
                </label>
                <input 
                    type="password" 
                    name="confirmar" 
                    required 
                    minLength={8}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    placeholder="Repita la nueva contraseña"
                />
            </div>

            <div className="pt-2">
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                    {isPending ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
            </div>
        </form>
    );
}
