"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/modules/auth/actions";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/");
            router.refresh();
        }
    }, [state, router]);

    return (
        <form action={formAction} className="flex flex-col gap-5 w-full">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="correo">
                    Correo Electrónico
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                        </svg>
                    </div>
                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-500 sm:text-sm sm:leading-6 transition-colors"
                        placeholder="admin@nexaerp.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="contrasena">
                    Contraseña
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-500 sm:text-sm sm:leading-6 transition-colors"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {state?.error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800/30">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{state.error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex w-full justify-center rounded-xl bg-teal-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                    </span>
                ) : (
                    "Ingresar al sistema"
                )}
            </button>
        </form>
    );
}
