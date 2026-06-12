import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerClientes } from "@/modules/clientes/actions";
import { ListaClientes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ClientesPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Clientes")) {
        return <NoAutorizado />;
    }

    const { data: clientes, totalPages } = await accionObtenerClientes(q, page, 15);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaClientes clientes={clientes} totalPages={totalPages} />
        </main>
    );
}