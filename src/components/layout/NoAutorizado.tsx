import Link from "next/link";

export function NoAutorizado() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900 lg:p-10 flex flex-col items-center justify-center">
            <div className="max-w-md text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Acceso Denegado</h1>
                <p className="mt-4 text-slate-600 text-lg">
                    No tienes permisos para acceder a esta sección. Si crees que esto es un error, contacta al administrador del sistema.
                </p>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    >
                        Volver al Dashboard principal
                    </Link>
                </div>
            </div>
        </main>
    );
}
