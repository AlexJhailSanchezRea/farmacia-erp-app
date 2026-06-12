import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { ListaHistorialCajas } from "./components";
import { servicioObtenerHistorialCajas } from "@/modules/caja/services";

export const metadata = {
    title: "Historial de Cajas | NexaERP",
};

export const dynamic = 'force-dynamic';

export default async function HistorialCajasPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Caja")) {
        return <NoAutorizado />;
    }

    const { data: cajas, totalPages } = await servicioObtenerHistorialCajas(q, page, 15);

    return (
        <PaginaModulo 
            titulo="Historial de Turnos de Caja" 
            descripcion="Visualice los turnos de apertura y cierre de caja anteriores."
            modulo="Caja"
            volverA="/caja"
            volverTexto="Volver a Caja"
        >
            <ListaHistorialCajas cajas={cajas} totalPages={totalPages} />
        </PaginaModulo>
    );
}
