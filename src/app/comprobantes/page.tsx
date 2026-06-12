import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerComprobantes } from "@/modules/comprobantes/actions";
import { ListaComprobantes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ComprobantesPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Comprobantes")) {
        return <NoAutorizado />;
    }

    const { data: comprobantes, totalPages } = await accionObtenerComprobantes(q, page, 15);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaComprobantes comprobantes={comprobantes} totalPages={totalPages} />
        </main>
    );
}