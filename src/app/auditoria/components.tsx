"use client";

import { AuditoriaRegistro } from "@/modules/auditoria/types";
import { useState } from "react";

export function TablaAuditoria({ registros }: { registros: AuditoriaRegistro[] }) {
    const [filtro, setFiltro] = useState("");

    const registrosFiltrados = registros.filter(r => 
        r.modulo.toLowerCase().includes(filtro.toLowerCase()) ||
        r.accion.toLowerCase().includes(filtro.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
        (r.usuarioCorreo && r.usuarioCorreo.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 lg:p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h3 className="font-semibold text-slate-800">Últimos registros ({registros.length})</h3>
                <div className="relative w-full sm:w-72">
                    <input 
                        type="text"
                        placeholder="Buscar por módulo, acción, correo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 lg:px-6 py-4">Fecha</th>
                            <th className="px-4 lg:px-6 py-4">Usuario</th>
                            <th className="px-4 lg:px-6 py-4">Módulo</th>
                            <th className="px-4 lg:px-6 py-4">Acción</th>
                            <th className="px-4 lg:px-6 py-4">Descripción</th>
                            <th className="px-4 lg:px-6 py-4 hidden lg:table-cell">Detalle</th>
                            <th className="px-4 lg:px-6 py-4 hidden xl:table-cell">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {registrosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                    No se encontraron registros de auditoría que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            registrosFiltrados.map((registro) => (
                                <tr key={registro.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span className="text-slate-900 font-medium">
                                            {new Date(registro.creadoEn).toLocaleDateString('es-ES')}
                                        </span>
                                        <span className="text-slate-500 block text-xs">
                                            {new Date(registro.creadoEn).toLocaleTimeString('es-ES')}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <span className="font-medium text-slate-700">{registro.usuarioCorreo || "Sistema"}</span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                            {registro.modulo}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                        <span className="text-slate-700">{registro.accion}</span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <span className="text-slate-600 max-w-xs block truncate" title={registro.descripcion}>
                                            {registro.descripcion}
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 hidden lg:table-cell text-xs text-slate-500">
                                        {registro.entidad && registro.entidadId ? (
                                            <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                                                {registro.entidad} #{registro.entidadId}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 hidden xl:table-cell text-xs font-mono text-slate-400">
                                        {registro.ip || "-"}
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
