"use client";

import { useState } from "react";
import { EstadoRegistro } from "@/generated/prisma/client";
import { Categoria } from "@/modules/categorias/types";
import { 
    accionCrearCategoria, 
    accionActualizarCategoria, 
    accionCambiarEstadoCategoria 
} from "@/modules/categorias/actions";

export function FormularioCategoria({ 
    categoriaAEditar, 
    onClose 
}: { 
    categoriaAEditar?: Categoria | null;
    onClose: () => void;
}) {
    const [nombre, setNombre] = useState(categoriaAEditar?.nombre || "");
    const [descripcion, setDescripcion] = useState(categoriaAEditar?.descripcion || "");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        let res;
        if (categoriaAEditar) {
            res = await accionActualizarCategoria({ id: categoriaAEditar.id, nombre, descripcion });
        } else {
            res = await accionCrearCategoria({ nombre, descripcion });
        }

        setCargando(false);

        if (!res.exito) {
            setError(res.mensaje);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">
                    {categoriaAEditar ? "Editar Categoría" : "Nueva Categoría"}
                </h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                            placeholder="Ej. Analgésicos"
                            required
                            minLength={2}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Descripción (Opcional)
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                            placeholder="Descripción de la categoría..."
                            rows={3}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ListaCategorias({ categoriasIniciales }: { categoriasIniciales: Categoria[] }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categoriaAEditar, setCategoriaAEditar] = useState<Categoria | null>(null);

    const handleCrear = () => {
        setCategoriaAEditar(null);
        setMostrarModal(true);
    };

    const handleEditar = (categoria: Categoria) => {
        setCategoriaAEditar(categoria);
        setMostrarModal(true);
    };

    const handleCambiarEstado = async (id: number, estadoActual: EstadoRegistro) => {
        if (!confirm(`¿Estás seguro de ${estadoActual === "ACTIVO" ? "desactivar" : "reactivar"} esta categoría?`)) return;
        
        const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        await accionCambiarEstadoCategoria(id, nuevoEstado as EstadoRegistro);
    };

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Categorías</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Gestiona las categorías de productos.</p>
                </div>
                <button
                    onClick={handleCrear}
                    className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-cyan-500 transition"
                >
                    + Nueva Categoría
                </button>
            </header>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                        <thead className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Nombre</th>
                                <th className="px-6 py-4 font-semibold">Descripción</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {categoriasIniciales.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-600 dark:text-slate-400">
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            ) : (
                                categoriasIniciales.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4 font-medium text-white">{cat.nombre}</td>
                                        <td className="px-6 py-4">{cat.descripcion || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                cat.estado === "ACTIVO" 
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                            }`}>
                                                {cat.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEditar(cat)}
                                                className="text-cyan-400 hover:text-cyan-300 mr-4 transition font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleCambiarEstado(cat.id, cat.estado)}
                                                className={`${
                                                    cat.estado === "ACTIVO" ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"
                                                } transition font-medium`}
                                            >
                                                {cat.estado === "ACTIVO" ? "Desactivar" : "Reactivar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {mostrarModal && (
                <FormularioCategoria 
                    categoriaAEditar={categoriaAEditar} 
                    onClose={() => setMostrarModal(false)} 
                />
            )}
        </div>
    );
}
