import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerMovimientos } from "@/modules/inventario/actions";
import { ListaMovimientos } from "./components";

export const dynamic = 'force-dynamic';

export default async function InventarioPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Inventario")) {
        return <NoAutorizado />;
    }

    const movimientos = await accionObtenerMovimientos();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaMovimientos movimientos={movimientos} />
        </main>
    );
}