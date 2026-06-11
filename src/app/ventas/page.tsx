import { accionObtenerVentas } from "@/modules/ventas/actions";
import { accionObtenerClientes } from "@/modules/clientes/actions";
import { accionObtenerProductos } from "@/modules/productos/actions";
import { ListaVentas } from "./components";

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
    const [ventas, clientes, productos] = await Promise.all([
        accionObtenerVentas(),
        accionObtenerClientes(),
        accionObtenerProductos()
    ]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaVentas 
                ventas={ventas} 
                clientes={clientes} 
                productos={productos} 
            />
        </main>
    );
}