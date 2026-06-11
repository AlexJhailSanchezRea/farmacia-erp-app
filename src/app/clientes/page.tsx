import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerClientes } from "@/modules/clientes/actions";
import { ListaClientes } from "./components";

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Clientes")) {
        return <NoAutorizado />;
    }

    const clientes = await accionObtenerClientes();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaClientes clientes={clientes} />
        </main>
    );
}