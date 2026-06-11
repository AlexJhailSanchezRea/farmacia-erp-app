import { CrearProductoInput, ActualizarProductoInput } from "./types";

export function validarCrearProducto(datos: CrearProductoInput): string | null {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del producto es obligatorio y debe tener al menos 2 caracteres.";
    }
    if (datos.precioCompra < 0) return "El precio de compra no puede ser negativo.";
    if (datos.precioVenta < 0) return "El precio de venta no puede ser negativo.";
    if (datos.stockActual < 0) return "El stock actual no puede ser negativo.";
    if (datos.stockMinimo < 0) return "El stock mínimo no puede ser negativo.";
    if (!datos.categoriaId || datos.categoriaId <= 0) return "Debe seleccionar una categoría válida.";
    return null;
}

export function validarActualizarProducto(datos: ActualizarProductoInput): string | null {
    if (!datos.id || datos.id <= 0) return "ID de producto inválido.";
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return "El nombre del producto es obligatorio y debe tener al menos 2 caracteres.";
    }
    if (datos.precioCompra < 0) return "El precio de compra no puede ser negativo.";
    if (datos.precioVenta < 0) return "El precio de venta no puede ser negativo.";
    if (datos.stockActual < 0) return "El stock actual no puede ser negativo.";
    if (datos.stockMinimo < 0) return "El stock mínimo no puede ser negativo.";
    if (!datos.categoriaId || datos.categoriaId <= 0) return "Debe seleccionar una categoría válida.";
    return null;
}
