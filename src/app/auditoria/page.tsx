import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { accionObtenerAuditoria } from "@/modules/auditoria/actions";
import { TablaAuditoria } from "./components";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { redirect } from "next/navigation";
import { verificarAccesoModulo } from "@/lib/permissions";

export default async function AuditoriaPage(props: { searchParams?: Promise<{ q?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || "";
    const page = Number(searchParams?.page) || 1;
    const usuario = await obtenerUsuarioAutenticado();

    if (!usuario) {
        redirect("/login");
    }

    if (!verificarAccesoModulo(usuario.rol.nombre, "Auditoria")) {
        redirect("/");
    }

    const { data: registros, totalPages } = await accionObtenerAuditoria(q, page, 15);

    return (
        <PaginaModulo 
            titulo="Auditoría de Acciones" 
            descripcion="Registro de actividades importantes realizadas en el sistema."
            modulo="Auditoria"
        >
            <TablaAuditoria registros={registros} totalPages={totalPages} />
        </PaginaModulo>
    );
}
