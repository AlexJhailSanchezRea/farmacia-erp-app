import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { ReportesDashboard } from "./components";
import { servicioObtenerReporteGeneral } from "@/modules/reportes/services";

export const metadata = {
    title: "Reportes | NexaERP",
};

export default async function ReportesPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Reportes")) {
        return <NoAutorizado />;
    }

    const datosReporte = await servicioObtenerReporteGeneral();

    return (
        <PaginaModulo 
            titulo="Reportes y Estadísticas" 
            descripcion="Panel consolidado con los indicadores clave del rendimiento del negocio."
            modulo="Reportes"
        >
            <ReportesDashboard datos={datosReporte} />
        </PaginaModulo>
    );
}