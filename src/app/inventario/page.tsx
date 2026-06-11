import { accionObtenerMovimientos } from "@/modules/inventario/actions";
import { ListaMovimientos } from "./components";

export const dynamic = 'force-dynamic';

export default async function InventarioPage() {
    const movimientos = await accionObtenerMovimientos();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaMovimientos movimientos={movimientos} />
        </main>
    );
}