"use client";

import { useState } from "react";
import { EstadoRegistro } from "@/generated/prisma/client";
import { ClienteCliente } from "@/modules/clientes/types";
import { 
    accionCrearCliente, 
    accionActualizarCliente, 
    accionCambiarEstadoCliente 
} from "@/modules/clientes/actions";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function FormularioCliente({ 
    clienteAEditar, 
    onClose 
}: { 
    clienteAEditar?: ClienteCliente | null;
    onClose: () => void;
}) {
    const [nombre, setNombre] = useState(clienteAEditar?.nombre || "");
    const [ciNit, setCiNit] = useState(clienteAEditar?.ciNit || "");
    const [telefono, setTelefono] = useState(clienteAEditar?.telefono || "");
    const [direccion, setDireccion] = useState(clienteAEditar?.direccion || "");
    const [correo, setCorreo] = useState(clienteAEditar?.correo || "");
    
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        const datos = {
            nombre,
            ciNit,
            telefono,
            direccion,
            correo
        };

        let res;
        if (clienteAEditar) {
            res = await accionActualizarCliente({ id: clienteAEditar.id, ...datos });
        } else {
            res = await accionCrearCliente(datos);
        }

        setCargando(false);

        if (!res.exito) {
            setError(res.mensaje);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {clienteAEditar ? "Editar Cliente" : "Nuevo Cliente"}
                </h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo / Razón Social *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                            placeholder="Ej. Juan Pérez"
                            required minLength={2}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CI / NIT</label>
                            <input
                                type="text"
                                value={ciNit}
                                onChange={(e) => setCiNit(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Opcional"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dirección</label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-800 transition"
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-cyan-500 transition disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ListaClientes({ clientes, totalPages }: { clientes: ClienteCliente[], totalPages: number }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [clienteAEditar, setClienteAEditar] = useState<ClienteCliente | null>(null);

    const handleCrear = () => {
        setClienteAEditar(null);
        setMostrarModal(true);
    };

    const handleEditar = (cliente: ClienteCliente) => {
        setClienteAEditar(cliente);
        setMostrarModal(true);
    };

    const handleCambiarEstado = async (id: number, estadoActual: EstadoRegistro) => {
        if (!confirm(`¿Estás seguro de ${estadoActual === "ACTIVO" ? "desactivar" : "reactivar"} este cliente?`)) return;
        
        const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        await accionCambiarEstadoCliente(id, nuevoEstado as EstadoRegistro);
    };

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clientes</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Gestiona el directorio de clientes de la empresa.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Buscador placeholder="Buscar por nombre o CI/NIT..." />
                    <button
                        onClick={handleCrear}
                        className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-cyan-500 transition whitespace-nowrap"
                    >
                        + Nuevo Cliente
                    </button>
                </div>
            </header>

            <div className="app-table-wrapper">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[800px]">
                    <thead className="app-table-head">
                        <tr>
                            <th className="app-table-cell font-semibold">Cliente</th>
                            <th className="app-table-cell font-semibold">Contacto</th>
                            <th className="app-table-cell font-semibold">Estado</th>
                            <th className="app-table-cell font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-600 dark:text-slate-400">
                                    No hay clientes registrados.
                                </td>
                            </tr>
                        ) : (
                            clientes.map((cli) => (
                                <tr key={cli.id} className="app-table-row">
                                    <td className="app-table-cell">
                                        <div className="font-medium text-slate-900 dark:text-white">{cli.nombre}</div>
                                        {cli.ciNit && <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">CI/NIT: {cli.ciNit}</div>}
                                    </td>
                                    <td className="app-table-cell">
                                        <div className="text-sm">{cli.telefono || cli.correo ? (
                                            <>
                                                {cli.telefono && <div>📞 {cli.telefono}</div>}
                                                {cli.correo && <div>📧 {cli.correo}</div>}
                                            </>
                                        ) : (
                                            <span className="text-slate-600 dark:text-slate-400">-</span>
                                        )}</div>
                                    </td>
                                    <td className="app-table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            cli.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {cli.estado}
                                        </span>
                                    </td>
                                    <td className="app-table-cell text-right">
                                        <button
                                            onClick={() => handleEditar(cli)}
                                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleCambiarEstado(cli.id, cli.estado)}
                                            className={`${
                                                cli.estado === "ACTIVO" ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"
                                            } transition font-medium`}
                                        >
                                            {cli.estado === "ACTIVO" ? "Desactivar" : "Reactivar"}
                                        </button>
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

            {mostrarModal && (
                <FormularioCliente 
                    clienteAEditar={clienteAEditar} 
                    onClose={() => setMostrarModal(false)} 
                />
            )}
        </div>
    );
}
