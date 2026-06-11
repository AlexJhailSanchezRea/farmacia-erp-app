import { accionObtenerCategorias } from "@/modules/categorias/actions";
import { ListaCategorias } from "./components";

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
    const categorias = await accionObtenerCategorias();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaCategorias categoriasIniciales={categorias} />
        </main>
    );
}