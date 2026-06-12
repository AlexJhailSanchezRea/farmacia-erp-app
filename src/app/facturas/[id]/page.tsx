import { accionObtenerFacturaPorId } from "@/modules/facturas/actions";
import { accionObtenerConfiguracion } from "@/modules/configuracion/actions";
import { VistaImpresionFactura } from "./components";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { verificarAccesoModulo } from "@/lib/permissions";

export default async function FacturaImpresionPage({ params }: { params: Promise<{ id: string }> }) {
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
        redirect("/login");
    }

    if (!verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        redirect("/");
    }

    const resolvedParams = await params;
    const facturaId = parseInt(resolvedParams.id, 10);
    if (isNaN(facturaId)) {
        notFound();
    }

    const factura = await accionObtenerFacturaPorId(facturaId);

    if (!factura) {
        notFound();
    }

    const config = await accionObtenerConfiguracion();

    return (
        <main className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col print:bg-white print:m-0 print:p-0">
            <div className="flex-1 p-4 md:p-8 flex justify-center print:p-0 print:block">
                <VistaImpresionFactura 
                    factura={factura} 
                    configuracion={config} 
                />
            </div>
        </main>
    );
}
