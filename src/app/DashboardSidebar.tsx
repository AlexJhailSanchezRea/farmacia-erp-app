"use client";

import Link from "next/link";
import { useState } from "react";

type Modulo = { nombre: string; ruta: string };

export function DashboardSidebar({ modulosPermitidos, usuarioInfo, logoutButton }: { modulosPermitidos: Modulo[], usuarioInfo: React.ReactNode, logoutButton: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile header / toggle */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">NexaERP</span>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 lg:border-r border-slate-800 bg-slate-900/80 p-6 flex flex-col h-full lg:min-h-screen`}>
                <div className="mb-10 hidden lg:block">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                        NexaERP
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-white">
                        Panel administrativo
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        ERP modular para pequeños y medianos negocios.
                    </p>
                </div>

                <nav className="space-y-2 flex-1">
                    {modulosPermitidos.map((modulo) => (
                        <Link
                            key={modulo.nombre}
                            href={modulo.ruta}
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            {modulo.nombre}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 border-t border-slate-800 pt-6">
                    {usuarioInfo}
                    <div className={!usuarioInfo ? "mt-4" : ""}>
                        {logoutButton}
                    </div>
                </div>
            </aside>
        </>
    );
}
