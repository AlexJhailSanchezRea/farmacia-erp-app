import { LoginForm } from "./components";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Iniciar Sesión | NexaERP",
    description: "Ingresa a tu cuenta de NexaERP",
};

export default async function LoginPage() {
    // Si ya tiene sesión válida, lo mandamos al dashboard
    const usuario = await obtenerUsuarioAutenticado();
    if (usuario) {
        redirect("/");
    }

    return (
        <main className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                    PharmaERP 360
                </h2>
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Acceso institucional al sistema de gestión
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
                <div className="bg-white dark:bg-slate-900 py-10 px-6 sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
