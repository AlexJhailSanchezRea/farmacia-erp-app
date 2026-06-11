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
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900 lg:p-10">
            <section className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600 shadow-sm"
                >
                    Volver al dashboard
                </Link>

                <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
                        {modulo}
                    </p>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {titulo}
                    </h1>

                    <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
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
                    <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Módulo en construcción
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Esta pantalla forma parte de la estructura inicial de PharmaERP 360. Más
                            adelante se conectará con la capa de aplicación, servicios,
                            repositorios y base de datos mediante Prisma.
                        </p>
                    </section>
                )}
            </section>
        </main>
    );
}