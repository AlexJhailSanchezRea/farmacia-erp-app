import { accionObtenerAlertasSanitarias } from "@/modules/alertas/actions";
import { AlertasDashboard } from "./components";

export default async function AlertasPage() {
    const alertas = await accionObtenerAlertasSanitarias();

    return (
        <AlertasDashboard alertas={alertas} />
    );
}
