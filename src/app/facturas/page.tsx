import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { accionObtenerFacturas } from "@/modules/facturas/actions";
import { ListaFacturas } from "./components";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect } from "next/navigation";
import { verificarAccesoModulo } from "@/lib/permissions";

export default async function FacturasPage() {
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
        redirect("/login");
    }

    if (!verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        redirect("/");
    }

    const facturas = await accionObtenerFacturas();

    return (
        <PaginaModulo 
            titulo="Facturación Demo" 
            descripcion="Simulación de emisión de facturas para pruebas y visualización."
            modulo="Facturas"
        >
            <ListaFacturas facturas={facturas} />
        </PaginaModulo>
    );
}
