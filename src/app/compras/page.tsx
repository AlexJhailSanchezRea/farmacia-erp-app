import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerCompras } from "@/modules/compras/actions";
import { accionObtenerProveedores } from "@/modules/proveedores/actions";
import { accionObtenerProductos } from "@/modules/productos/actions";
import { servicioObtenerCajaAbierta } from "@/modules/caja/services";
import { ListaCompras } from "./components";

export const dynamic = 'force-dynamic';

export default async function ComprasPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Compras")) {
        return <NoAutorizado />;
    }

    const [{ data: compras, totalPages }, { data: proveedores }, { data: productos }, cajaAbierta] = await Promise.all([
        accionObtenerCompras(q, page, 15),
        accionObtenerProveedores("", 1, 10000), // Get all providers for the dropdown
        accionObtenerProductos("", 1, 10000), // Get all products for the dropdown
        servicioObtenerCajaAbierta()
    ]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <ListaCompras 
                compras={compras} 
                proveedores={proveedores} 
                productos={productos} 
                cajaAbierta={!!cajaAbierta}
                totalPages={totalPages}
            />
        </main>
    );
}