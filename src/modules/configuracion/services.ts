import { obtenerConfiguracion, actualizarConfiguracion } from "./repository";
import { ConfiguracionSistema, ConfiguracionUpdateData } from "./types";

export async function servicioObtenerConfiguracion(): Promise<ConfiguracionSistema> {
    return obtenerConfiguracion();
}

export async function servicioActualizarConfiguracion(data: ConfiguracionUpdateData): Promise<ConfiguracionSistema> {
    return actualizarConfiguracion(data);
}
