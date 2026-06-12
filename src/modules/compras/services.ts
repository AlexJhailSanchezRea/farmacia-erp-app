import { 
    obtenerCompras as repoObtenerCompras,
    crearCompraConTransaccion
} from "./repository";
import { CompraCliente, CrearCompraInput } from "./types";
import { validarCrearCompra } from "./validations";

export async function servicioObtenerCompras(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: CompraCliente[], total: number, totalPages: number }> {
    return repoObtenerCompras(q, pagina, limite);
}

export async function servicioCrearCompra(datos: CrearCompraInput): Promise<{exito: boolean; mensaje: string; compra?: CompraCliente}> {
    const errorValidacion = validarCrearCompra(datos);
    if (errorValidacion) {
        return { exito: false, mensaje: errorValidacion };
    }

    // Aquí podríamos validar que el proveedor está activo y los productos también,
    // pero para mantenerlo simple asumiremos que desde la UI solo se pueden seleccionar
    // aquellos que están activos. El repository se encarga de la consistencia del stock.

    const nuevaCompra = await crearCompraConTransaccion(datos);
    return { exito: true, mensaje: "Compra registrada y stock actualizado exitosamente.", compra: nuevaCompra };
}
