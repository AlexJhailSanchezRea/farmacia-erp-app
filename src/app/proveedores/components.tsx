"use client";

import { useState } from "react";
import { EstadoRegistro } from "@/generated/prisma/client";
import { ProveedorCliente } from "@/modules/proveedores/types";
import { 
    accionCrearProveedor, 
    accionActualizarProveedor, 
    accionCambiarEstadoProveedor 
} from "@/modules/proveedores/actions";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function FormularioProveedor({ 
    proveedorAEditar, 
    onClose 
}: { 
    proveedorAEditar?: ProveedorCliente | null;
    onClose: () => void;
}) {
    const [nombre, setNombre] = useState(proveedorAEditar?.nombre || "");
    const [nit, setNit] = useState(proveedorAEditar?.nit || "");
    const [telefono, setTelefono] = useState(proveedorAEditar?.telefono || "");
    const [direccion, setDireccion] = useState(proveedorAEditar?.direccion || "");
    const [correo, setCorreo] = useState(proveedorAEditar?.correo || "");
    const [contacto, setContacto] = useState(proveedorAEditar?.contacto || "");
    
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        const datos = {
            nombre,
            nit,
            telefono,
            direccion,
            correo,
            contacto
        };

        let res;
        if (proveedorAEditar) {
            res = await accionActualizarProveedor({ id: proveedorAEditar.id, ...datos });
        } else {
            res = await accionCrearProveedor(datos);
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
            <div className="w-full max-w-2xl rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {proveedorAEditar ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Comercial / Razón Social *</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Ej. Distribuidora Farmacéutica S.A."
                                required minLength={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIT</label>
                            <input
                                type="text"
                                value={nit}
                                onChange={(e) => setNit(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Opcional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de Contacto</label>
                            <input
                                type="text"
                                value={contacto}
                                onChange={(e) => setContacto(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                                placeholder="Ej. Roberto Sánchez"
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

                        <div>
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

export function ListaProveedores({ proveedores, totalPages }: { proveedores: ProveedorCliente[], totalPages: number }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proveedorAEditar, setProveedorAEditar] = useState<ProveedorCliente | null>(null);

    const handleCrear = () => {
        setProveedorAEditar(null);
        setMostrarModal(true);
    };

    const handleEditar = (proveedor: ProveedorCliente) => {
        setProveedorAEditar(proveedor);
        setMostrarModal(true);
    };

    const handleCambiarEstado = async (id: number, estadoActual: EstadoRegistro) => {
        if (!confirm(`¿Estás seguro de ${estadoActual === "ACTIVO" ? "desactivar" : "reactivar"} este proveedor?`)) return;
        
        const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        await accionCambiarEstadoProveedor(id, nuevoEstado as EstadoRegistro);
    };

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Proveedores</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Gestiona las empresas que suministran productos.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Buscador placeholder="Buscar por nombre o NIT..." />
                    <button
                        onClick={handleCrear}
                        className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-cyan-500 transition whitespace-nowrap"
                    >
                        + Nuevo Proveedor
                    </button>
                </div>
            </header>

            <div className="app-table-wrapper">
                <table className="app-table">
                    <thead className="app-table-head">
                        <tr>
                            <th className="app-table-cell font-semibold">Proveedor</th>
                            <th className="app-table-cell font-semibold">Representante</th>
                            <th className="app-table-cell font-semibold">Contacto</th>
                            <th className="app-table-cell font-semibold">Estado</th>
                            <th className="app-table-cell font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {proveedores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-600 dark:text-slate-400">
                                    No hay proveedores registrados.
                                </td>
                            </tr>
                        ) : (
                            proveedores.map((prov) => (
                                <tr key={prov.id} className="app-table-row">
                                    <td className="app-table-cell">
                                        <div className="font-medium text-slate-900 dark:text-white">{prov.nombre}</div>
                                        {prov.nit && <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">NIT: {prov.nit}</div>}
                                    </td>
                                    <td className="app-table-cell">{prov.contacto || "-"}</td>
                                    <td className="app-table-cell">
                                        <div className="text-sm">{prov.telefono || prov.correo ? (
                                            <>
                                                {prov.telefono && <div>📞 {prov.telefono}</div>}
                                                {prov.correo && <div>📧 {prov.correo}</div>}
                                            </>
                                        ) : (
                                            <span className="text-slate-600 dark:text-slate-400">-</span>
                                        )}</div>
                                    </td>
                                    <td className="app-table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            prov.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {prov.estado}
                                        </span>
                                    </td>
                                    <td className="app-table-cell text-right">
                                        <button
                                            onClick={() => handleEditar(prov)}
                                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleCambiarEstado(prov.id, prov.estado)}
                                            className={`${
                                                prov.estado === "ACTIVO" ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"
                                            } transition font-medium`}
                                        >
                                            {prov.estado === "ACTIVO" ? "Desactivar" : "Reactivar"}
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
                <FormularioProveedor 
                    proveedorAEditar={proveedorAEditar} 
                    onClose={() => setMostrarModal(false)} 
                />
            )}
        </div>
    );
}
