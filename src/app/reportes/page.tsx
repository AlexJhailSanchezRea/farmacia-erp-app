import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { ReportesDashboard } from "./components";
import { servicioObtenerReporteGeneral } from "@/modules/reportes/services";

export const metadata = {
    title: "Reportes | NexaERP",
};

export default async function ReportesPage() {
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