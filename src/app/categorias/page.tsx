import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerCategorias } from "@/modules/categorias/actions";
import { ListaCategorias } from "./components";

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Categorías")) {
        return <NoAutorizado />;
    }

    const categorias = await accionObtenerCategorias();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaCategorias categoriasIniciales={categorias} />
        </main>
    );
}