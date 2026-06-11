"use server";

import { servicioObtenerAlertasSanitarias } from "./services";
import { AlertasSanitarias } from "./types";

export async function accionObtenerAlertasSanitarias(): Promise<AlertasSanitarias> {
    return servicioObtenerAlertasSanitarias();
}
