"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { UsuarioCliente } from "@/modules/usuarios/types";
import { guardarUsuarioAction, alternarEstadoUsuarioAction, resetearContrasenaAccion } from "@/modules/usuarios/actions";

export function UsuariosManager({ usuarios, roles }: { usuarios: UsuarioCliente[], roles: { id: number, nombre: string }[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<UsuarioCliente | null>(null);
    const [usuarioReset, setUsuarioReset] = useState<UsuarioCliente | null>(null);

    const handleCrear = () => {
        setUsuarioEditar(null);
        setIsModalOpen(true);
    };

    const handleEditar = (u: UsuarioCliente) => {
        setUsuarioEditar(u);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setUsuarioEditar(null);
        setUsuarioReset(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Listado de Usuarios</h2>
                <button
                    onClick={handleCrear}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo Usuario
                </button>
            </div>

            {/* Tabla de Usuarios */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-white dark:bg-slate-900/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 dark:text-white">{u.nombre}</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{u.correo}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                                            {u.rol.nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            u.estado === 'ACTIVO' 
                                                ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20' 
                                                : 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20'
                                        }`}>
                                            {u.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => setUsuarioReset(u)}
                                            className="text-amber-500 hover:text-amber-400 mr-4 transition-colors"
                                        >
                                            Resetear Clave
                                        </button>
                                        <button 
                                            onClick={() => handleEditar(u)}
                                            className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <BotonAlternarEstado usuario={u} />
                                    </td>
                                </tr>
                            ))}
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
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                            {usuarioEditar ? "Editar Usuario" : "Nuevo Usuario"}
                        </h3>
                        <UsuarioForm usuario={usuarioEditar} roles={roles} onClose={handleClose} />
                    </div>
                </div>
            )}

            {/* Modal de Reset de Contraseña */}
            {usuarioReset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button onClick={handleClose} className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            Resetear Contraseña
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Para el usuario: <span className="font-semibold text-slate-700 dark:text-slate-300">{usuarioReset.correo}</span>
                        </p>
                        <ResetearContrasenaForm usuarioId={usuarioReset.id} onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}

function BotonAlternarEstado({ usuario }: { usuario: UsuarioCliente }) {
    const [isPending, startTransition] = useTransition();

    const handleAlternar = () => {
        if (!confirm(`¿Estás seguro de que deseas ${usuario.estado === "ACTIVO" ? "desactivar" : "activar"} este usuario?`)) return;
        
        startTransition(async () => {
            const result = await alternarEstadoUsuarioAction(usuario.id, usuario.estado);
            if (result?.error) {
                alert(result.error);
            }
        });
    };

    return (
        <button 
            onClick={handleAlternar}
            disabled={isPending}
            className={`${usuario.estado === 'ACTIVO' ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'} disabled:opacity-50 transition-colors`}
        >
            {isPending ? "Procesando..." : (usuario.estado === 'ACTIVO' ? 'Desactivar' : 'Activar')}
        </button>
    );
}

function UsuarioForm({ usuario, roles, onClose }: { usuario: UsuarioCliente | null, roles: { id: number, nombre: string }[], onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(guardarUsuarioAction, null);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            {usuario && <input type="hidden" name="id" value={usuario.id} />}
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input 
                    name="nombre" 
                    defaultValue={usuario?.nombre} 
                    required 
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 dark:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                <input 
                    name="correo" 
                    type="email"
                    defaultValue={usuario?.correo} 
                    required 
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 dark:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol</label>
                <select 
                    name="rolId" 
                    defaultValue={usuario?.rol.id || ""} 
                    required
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&>option]:bg-slate-50 dark:bg-slate-800"
                >
                    <option value="" disabled>Seleccione un rol...</option>
                    {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {usuario ? "Nueva Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                </label>
                <input 
                    name="contrasena" 
                    type="password"
                    required={!usuario}
                    minLength={6}
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

function ResetearContrasenaForm({ usuarioId, onClose }: { usuarioId: number, onClose: () => void }) {
    const [state, formAction, isPending] = useActionState(resetearContrasenaAccion, null);

    useEffect(() => {
        if (state?.success) {
            alert(state.mensaje);
            onClose();
        }
    }, [state, onClose]);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="usuarioId" value={usuarioId} />
            
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nueva Contraseña Temporal
                </label>
                <input 
                    type="password" 
                    name="nueva" 
                    required 
                    minLength={8}
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                    placeholder="Mínimo 8 caracteres"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirmar Contraseña
                </label>
                <input 
                    type="password" 
                    name="confirmar" 
                    required 
                    minLength={8}
                    className="block w-full rounded-lg border-0 bg-slate-50 dark:bg-slate-800 py-2.5 px-3 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
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
                    className="rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Reseteando..." : "Confirmar Reset"}
                </button>
            </div>
        </form>
    );
}
