"use client";

import { ConfiguracionSistema } from "@/modules/configuracion/types";
import { accionActualizarConfiguracion } from "@/modules/configuracion/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function FormularioConfiguracion({ configuracionActual }: { configuracionActual: ConfiguracionSistema }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            nombreComercial: formData.get("nombreComercial") as string,
            razonSocial: formData.get("razonSocial") as string,
            nit: formData.get("nit") as string,
            direccion: formData.get("direccion") as string,
            telefono: formData.get("telefono") as string,
            correo: formData.get("correo") as string || null,
            ciudad: formData.get("ciudad") as string,
            mensajeComprobante: formData.get("mensajeComprobante") as string,
        };

        const res = await accionActualizarConfiguracion(data);

        if (res.success) {
            setSuccess(true);
            router.refresh();
        } else {
            setError(res.error || "Ocurrió un error inesperado.");
        }

        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 lg:p-8 max-w-4xl mx-auto mt-8">
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
                    <p className="font-semibold text-sm">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-semibold text-sm">Configuración guardada exitosamente.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                    <div>
                        <label htmlFor="nombreComercial" className="block text-sm font-medium leading-6 text-slate-900">
                            Nombre Comercial <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nombreComercial"
                                id="nombreComercial"
                                required
                                defaultValue={configuracionActual.nombreComercial}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="razonSocial" className="block text-sm font-medium leading-6 text-slate-900">
                            Razón Social <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="razonSocial"
                                id="razonSocial"
                                required
                                defaultValue={configuracionActual.razonSocial}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nit" className="block text-sm font-medium leading-6 text-slate-900">
                            NIT / Identificador <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="nit"
                                id="nit"
                                required
                                defaultValue={configuracionActual.nit}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium leading-6 text-slate-900">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="telefono"
                                id="telefono"
                                required
                                defaultValue={configuracionActual.telefono}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="direccion" className="block text-sm font-medium leading-6 text-slate-900">
                            Dirección Completa <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="direccion"
                                id="direccion"
                                required
                                defaultValue={configuracionActual.direccion}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ciudad" className="block text-sm font-medium leading-6 text-slate-900">
                            Ciudad <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="ciudad"
                                id="ciudad"
                                required
                                defaultValue={configuracionActual.ciudad}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium leading-6 text-slate-900">
                            Correo Electrónico (Opcional)
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="correo"
                                id="correo"
                                defaultValue={configuracionActual.correo || ""}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="mensajeComprobante" className="block text-sm font-medium leading-6 text-slate-900">
                            Mensaje en Comprobantes (Pie de página) <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                            <textarea
                                name="mensajeComprobante"
                                id="mensajeComprobante"
                                rows={3}
                                required
                                defaultValue={configuracionActual.mensajeComprobante}
                                className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6 px-3 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-slate-200 pt-6">
                    <p className="text-xs text-slate-500 flex-1">
                        Última actualización: {new Date(configuracionActual.actualizadoEn).toLocaleString('es-ES')}
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Guardando..." : "Guardar Configuración"}
                    </button>
                </div>
            </form>
        </div>
    );
}
