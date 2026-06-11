import { verificarAccesoModulo } from "@/lib/permissions";
import { NoAutorizado } from "@/components/layout/NoAutorizado";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerAlertasSanitarias } from "@/modules/alertas/actions";
import { AlertasDashboard } from "./components";

export default async function AlertasPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarAccesoModulo(usuario.rol.nombre, "Alertas Sanitarias")) {
        return <NoAutorizado />;
    }

    const alertas = await accionObtenerAlertasSanitarias();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <AlertasDashboard alertas={alertas} />
        </main>
    );
}
