"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export function Buscador({ placeholder = "Buscar..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isPending, startTransition] = useTransition();
    
    // Estado local para el input
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q")?.toString() || "");

    // Efecto para debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams);
                if (searchTerm) {
                    params.set("q", searchTerm);
                    // Si busca algo nuevo, volver a la página 1
                    params.set("page", "1");
                } else {
                    params.delete("q");
                }
                replace(`${pathname}?${params.toString()}`);
            });
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, pathname, replace, searchParams]);

    return (
        <div className="relative flex flex-1 flex-shrink-0 print:hidden">
            <label htmlFor="search" className="sr-only">
                Buscar
            </label>
            <div className="relative w-full max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className={`h-5 w-5 ${isPending ? 'text-teal-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="search"
                    id="search"
                    name="q"
                    className="block w-full rounded-xl border-0 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-500 dark:placeholder:text-slate-600 dark:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 transition-shadow"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
}
