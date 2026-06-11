import { accionObtenerComprobantes } from "@/modules/comprobantes/actions";
import { ListaComprobantes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ComprobantesPage() {
    const comprobantes = await accionObtenerComprobantes();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaComprobantes comprobantes={comprobantes} />
        </main>
    );
}