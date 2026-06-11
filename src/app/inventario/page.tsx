import { PaginaModulo } from "@/components/layout/PaginaModulo";

export default function InventarioPage() {
    return (
        <PaginaModulo
            modulo="Control"
            titulo="Inventario"
            descripcion="Control de existencias, movimientos de stock, productos activos y productos con stock bajo."
        />
    );
}