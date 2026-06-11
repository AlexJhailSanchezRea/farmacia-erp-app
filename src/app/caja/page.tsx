import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { CajaManager } from "./components";
import { servicioObtenerHistorialCaja, servicioObtenerResumenCaja } from "@/modules/caja/services";

export const metadata = {
    title: "Caja | NexaERP",
};

export default async function CajaPage() {
    const [movimientos, resumen] = await Promise.all([
        servicioObtenerHistorialCaja(),
        servicioObtenerResumenCaja()
    ]);

    return (
        <PaginaModulo 
            titulo="Gestión de Caja" 
            descripcion="Administre el flujo de efectivo, observe el saldo real e inserte movimientos manuales."
            modulo="Caja"
        >
            <CajaManager movimientos={movimientos} resumen={resumen} />
        </PaginaModulo>
    );
}