import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { FormularioConfiguracion } from "./components";
import { accionObtenerConfiguracion } from "@/modules/configuracion/actions";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect } from "next/navigation";
import { verificarAccesoModulo } from "@/lib/permissions";

export default async function ConfiguracionPage() {
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
        redirect("/login");
    }

    if (!verificarAccesoModulo(usuario.rol.nombre, "Configuracion")) {
        redirect("/");
    }

    const config = await accionObtenerConfiguracion();

    return (
        <PaginaModulo 
            titulo="Configuración Institucional" 
            descripcion="Administra los datos de la empresa para recibos y facturas."
            modulo="Configuracion"
        >
            <FormularioConfiguracion configuracionActual={config} />
        </PaginaModulo>
    );
}
