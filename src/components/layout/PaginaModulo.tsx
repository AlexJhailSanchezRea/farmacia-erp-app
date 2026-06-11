import Link from "next/link";
type PaginaModuloProps = {
    titulo: string;
    descripcion: string;
    modulo: string;
    children?: React.ReactNode;
};

export function PaginaModulo({
    titulo,
    descripcion,
    modulo,
    children
}: PaginaModuloProps) {
    return (
        <main className="min-h-screen bg-slate-950 p-6 text-slate-100 lg:p-10">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                >
                    Volver al dashboard
                </Link>

                <header className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                        {modulo}
                    </p>

                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                        {titulo}
                    </h1>

                    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                        {descripcion}
                    </p>
                </header>

                {children ? (
                    <section className="mt-8 w-full overflow-x-auto pb-4">
                        <div className="min-w-[800px] lg:min-w-0">
                            {children}
                        </div>
                    </section>
                ) : (
                    <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
                        <h2 className="text-xl font-semibold text-white">
                            Módulo en construcción
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Esta pantalla forma parte de la estructura inicial de NexaERP. Más
                            adelante se conectará con la capa de aplicación, servicios,
                            repositorios y base de datos mediante Prisma.
                        </p>
                    </section>
                )}
            </section>
        </main>
    );
}