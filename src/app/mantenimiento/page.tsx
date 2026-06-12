import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { redirect } from "next/navigation";
import { PanelMantenimiento } from "./components";

export default async function MantenimientoPage() {
    const usuario = await obtenerUsuarioAutenticado();
    
    if (!usuario || usuario.rol.nombre !== "Administrador") {
        redirect("/");
    }

    return (
        <PaginaModulo 
            modulo="Mantenimiento" 
            titulo="Gestión del Sistema y Respaldo" 
            descripcion="Realiza copias de seguridad de la base de datos y tareas administrativas críticas."
            volverA="/"
        >
            <PanelMantenimiento />
        </PaginaModulo>
    );
}
