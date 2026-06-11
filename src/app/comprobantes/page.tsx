import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerComprobantes } from "@/modules/comprobantes/actions";
import { ListaComprobantes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ComprobantesPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Comprobantes")) {
        return <NoAutorizado />;
    }

    const comprobantes = await accionObtenerComprobantes();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaComprobantes comprobantes={comprobantes} />
        </main>
    );
}