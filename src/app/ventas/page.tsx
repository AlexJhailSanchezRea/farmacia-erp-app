import { verificarAccesoModulo, verificarPermisoAccion } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerVentas } from "@/modules/ventas/actions";
import { accionObtenerClientes } from "@/modules/clientes/actions";
import { accionObtenerProductos } from "@/modules/productos/actions";
import { ListaVentas } from "./components";

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Ventas")) {
        return <NoAutorizado />;
    }

    const [ventas, clientes, productos] = await Promise.all([
        accionObtenerVentas(),
        accionObtenerClientes(),
        accionObtenerProductos()
    ]);

    const puedeAnular = verificarPermisoAccion(usuario.rol.nombre, "anular_venta");

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaVentas 
                ventas={ventas} 
                clientes={clientes} 
                productos={productos} 
                puedeAnular={puedeAnular}
            />
        </main>
    );
}