import { verificarAccesoModulo, verificarPermisoAccion } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerVentas } from "@/modules/ventas/actions";
import { accionObtenerClientes } from "@/modules/clientes/actions";
import { accionObtenerProductos } from "@/modules/productos/actions";
import { servicioObtenerCajaAbierta } from "@/modules/caja/services";
import { ListaVentas } from "./components";

export const dynamic = 'force-dynamic';

export default async function VentasPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Ventas")) {
        return <NoAutorizado />;
    }

    const [{ data: ventas, totalPages }, { data: clientes }, { data: productos }, cajaAbierta] = await Promise.all([
        accionObtenerVentas(q, page, 15),
        accionObtenerClientes("", 1, 10000),
        accionObtenerProductos("", 1, 10000), // Get all products for the dropdown
        servicioObtenerCajaAbierta()
    ]);

    const puedeAnular = verificarPermisoAccion(usuario.rol.nombre, "anular_venta");

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaVentas 
                ventas={ventas} 
                clientes={clientes} 
                productos={productos} 
                puedeAnular={puedeAnular}
                cajaAbierta={!!cajaAbierta}
                totalPages={totalPages}
            />
        </main>
    );
}