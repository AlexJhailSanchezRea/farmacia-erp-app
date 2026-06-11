import { accionObtenerProductos, accionObtenerCategoriasActivas } from "@/modules/productos/actions";
import { ListaProductos } from "./components";

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
    const [productos, categorias] = await Promise.all([
        accionObtenerProductos(),
        accionObtenerCategoriasActivas()
    ]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaProductos productos={productos} categorias={categorias} />
        </main>
    );
}