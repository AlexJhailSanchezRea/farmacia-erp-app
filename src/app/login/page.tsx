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
        <main className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-950 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-white mb-2">
                    NexaERP
                </h2>
                <p className="text-center text-sm text-slate-400">
                    Ingresa tus credenciales para acceder al sistema
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-xl py-10 px-6 sm:rounded-3xl sm:px-10 border border-slate-800/50 shadow-2xl">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
