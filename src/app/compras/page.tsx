import { accionObtenerCompras } from "@/modules/compras/actions";
import { accionObtenerProveedores } from "@/modules/proveedores/actions";
import { accionObtenerProductos } from "@/modules/productos/actions";
import { ListaCompras } from "./components";

export const dynamic = 'force-dynamic';

export default async function ComprasPage() {
    const [compras, proveedores, productos] = await Promise.all([
        accionObtenerCompras(),
        accionObtenerProveedores(),
        accionObtenerProductos()
    ]);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <ListaCompras 
                compras={compras} 
                proveedores={proveedores} 
                productos={productos} 
            />
        </main>
    );
}