import { accionObtenerProveedores } from "@/modules/proveedores/actions";
import { ListaProveedores } from "./components";

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
    const proveedores = await accionObtenerProveedores();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaProveedores proveedores={proveedores} />
        </main>
    );
}