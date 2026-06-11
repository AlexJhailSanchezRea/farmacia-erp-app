import { accionObtenerClientes } from "@/modules/clientes/actions";
import { ListaClientes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
    const clientes = await accionObtenerClientes();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaClientes clientes={clientes} />
        </main>
    );
}