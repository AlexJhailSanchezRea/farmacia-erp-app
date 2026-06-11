import { CrearCompraInput } from "./types";

export function validarCrearCompra(datos: CrearCompraInput): string | null {
    if (!datos.proveedorId || datos.proveedorId <= 0) {
        return "Debe seleccionar un proveedor válido.";
    }

    if (!datos.detalles || datos.detalles.length === 0) {
        return "La compra debe tener al menos un producto.";
    }

    for (let i = 0; i < datos.detalles.length; i++) {
        const det = datos.detalles[i];
        if (!det.productoId || det.productoId <= 0) {
            return `El producto de la línea ${i + 1} es inválido.`;
        }
        if (det.cantidad <= 0) {
            return `La cantidad del producto en la línea ${i + 1} debe ser mayor a 0.`;
        }
        if (det.precioUnitario < 0) {
            return `El precio unitario en la línea ${i + 1} no puede ser negativo.`;
        }
    }

    return null;
}
