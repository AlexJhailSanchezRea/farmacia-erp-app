import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerProveedores } from "@/modules/proveedores/actions";
import { ListaProveedores } from "./components";

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Proveedores")) {
        return <NoAutorizado />;
    }

    const { data: proveedores, totalPages } = await accionObtenerProveedores(q, page, 15);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaProveedores proveedores={proveedores} totalPages={totalPages} />
        </main>
    );
}