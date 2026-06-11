import { obtenerAlertasSanitarias } from "./repository";
import { AlertasSanitarias } from "./types";

export async function servicioObtenerAlertasSanitarias(): Promise<AlertasSanitarias> {
    return obtenerAlertasSanitarias();
}
