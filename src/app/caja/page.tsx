import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { CajaManager } from "./components";
import { servicioObtenerHistorialMovimientos, servicioObtenerResumenCaja, servicioObtenerCajaAbierta } from "@/modules/caja/services";

export const metadata = {
    title: "Caja | NexaERP",
};

export default async function CajaPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Caja")) {
        return <NoAutorizado />;
    }

    const [movimientos, resumen, cajaAbierta] = await Promise.all([
        servicioObtenerHistorialMovimientos(),
        servicioObtenerResumenCaja(),
        servicioObtenerCajaAbierta()
    ]);

    return (
        <PaginaModulo 
            titulo="Gestión de Caja" 
            descripcion="Administre el flujo de efectivo, observe el saldo real e inserte movimientos manuales."
            modulo="Caja"
        >
            <CajaManager 
                movimientos={movimientos} 
                resumen={resumen} 
                cajaAbierta={cajaAbierta}
                rolUsuario={usuario.rol.nombre}
            />
        </PaginaModulo>
    );
}