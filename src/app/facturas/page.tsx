import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { accionObtenerFacturas } from "@/modules/facturas/actions";
import { ListaFacturas } from "./components";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect } from "next/navigation";
import { verificarAccesoModulo } from "@/lib/permissions";

export default async function FacturasPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
        redirect("/login");
    }

    if (!verificarAccesoModulo(usuario.rol.nombre, "Facturación Demo")) {
        redirect("/");
    }

    const { data: facturas, totalPages } = await accionObtenerFacturas(q, page, 15);

    return (
        <PaginaModulo 
            titulo="Facturación Demo" 
            descripcion="Simulación de emisión de facturas para pruebas y visualización."
            modulo="Facturas"
        >
            <ListaFacturas facturas={facturas} totalPages={totalPages} />
        </PaginaModulo>
    );
}
