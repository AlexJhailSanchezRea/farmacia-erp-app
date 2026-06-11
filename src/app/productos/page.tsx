import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerProductos, accionObtenerCategoriasActivas } from "@/modules/productos/actions";
import { ListaProductos } from "./components";

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Productos")) {
        return <NoAutorizado />;
    }

    const [productos, categorias] = await Promise.all([
        accionObtenerProductos(),
        accionObtenerCategoriasActivas()
    ]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaProductos productos={productos} categorias={categorias} />
        </main>
    );
}