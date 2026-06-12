"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Modulo = { nombre: string; ruta: string };

function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(current);
    }, []);

    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("nexa-theme", "light");
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("nexa-theme", "dark");
            setTheme("dark");
        }
    };

    if (!theme) return <div className="h-9"></div>;

    return (
        <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 transition mb-3"
        >
            <span>Tema: {theme === "dark" ? "Oscuro" : "Claro"}</span>
            <span className="text-xl leading-none">{theme === "dark" ? "🌙" : "☀️"}</span>
        </button>
    );
}

export function DashboardSidebar({ modulosPermitidos, usuarioInfo, logoutButton }: { modulosPermitidos: Modulo[], usuarioInfo: React.ReactNode, logoutButton: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile header / toggle */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 print:hidden transition">
                <span className="text-teal-600 dark:text-teal-400 font-bold tracking-widest text-sm uppercase">PharmaERP 360</span>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col h-full lg:min-h-screen print:hidden transition`}>
                <div className="mb-10 hidden lg:block">
                    <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        PharmaERP 360
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                        Panel Administrativo
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Gestión corporativa y control clínico.
                    </p>
                </div>

                <nav className="space-y-2 flex-1">
                    {modulosPermitidos.map((modulo) => (
                        <Link
                            key={modulo.nombre}
                            href={modulo.ruta}
                            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-teal-600 dark:text-slate-300 transition dark:hover:bg-slate-800 dark:hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            onClick={() => setIsOpen(false)}
                        >
                            {modulo.nombre}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 border-t border-slate-300 dark:border-slate-700 dark:border-slate-800 pt-6">
                    <ThemeToggle />
                    {usuarioInfo}
                    <div className={!usuarioInfo ? "mt-4" : ""}>
                        {logoutButton}
                    </div>
                </div>
            </aside>
        </>
    );
}
