"use client";

import { useState } from "react";
import { EstadoRegistro } from "@/generated/prisma/client";
import { ProductoCliente } from "@/modules/productos/types";
import { Categoria } from "@/modules/categorias/types";
import { 
    accionCrearProducto, 
    accionActualizarProducto, 
    accionCambiarEstadoProducto 
} from "@/modules/productos/actions";
import { Buscador } from "@/components/layout/Buscador";
import { Paginacion } from "@/components/layout/Paginacion";

export function FormularioProducto({ 
    productoAEditar, 
    categorias,
    onClose 
}: { 
    productoAEditar?: ProductoCliente | null;
    categorias: Categoria[];
    onClose: () => void;
}) {
    const [nombre, setNombre] = useState(productoAEditar?.nombre || "");
    const [descripcion, setDescripcion] = useState(productoAEditar?.descripcion || "");
    const [codigoBarra, setCodigoBarra] = useState(productoAEditar?.codigoBarra || "");
    const [precioCompra, setPrecioCompra] = useState(productoAEditar?.precioCompra?.toString() || "0");
    const [precioVenta, setPrecioVenta] = useState(productoAEditar?.precioVenta?.toString() || "0");
    const [stockActual, setStockActual] = useState(productoAEditar?.stockActual?.toString() || "0");
    const [stockMinimo, setStockMinimo] = useState(productoAEditar?.stockMinimo?.toString() || "0");
    const [categoriaId, setCategoriaId] = useState(productoAEditar?.categoriaId?.toString() || "");
    
    // Campos Farmacia
    const [principioActivo, setPrincipioActivo] = useState(productoAEditar?.principioActivo || "");
    const [laboratorio, setLaboratorio] = useState(productoAEditar?.laboratorio || "");
    const [presentacion, setPresentacion] = useState(productoAEditar?.presentacion || "");
    const [concentracion, setConcentracion] = useState(productoAEditar?.concentracion || "");
    const [requiereReceta, setRequiereReceta] = useState(productoAEditar?.requiereReceta || false);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        const idCat = parseInt(categoriaId);
        if (!idCat) {
            setError("Debe seleccionar una categoría.");
            setCargando(false);
            return;
        }

        const datos = {
            nombre,
            descripcion,
            codigoBarra,
            precioCompra: parseFloat(precioCompra) || 0,
            precioVenta: parseFloat(precioVenta) || 0,
            stockActual: parseInt(stockActual) || 0,
            stockMinimo: parseInt(stockMinimo) || 0,
            categoriaId: idCat,
            principioActivo,
            laboratorio,
            presentacion,
            concentracion,
            requiereReceta
        };

        let res;
        if (productoAEditar) {
            res = await accionActualizarProducto({ id: productoAEditar.id, ...datos });
        } else {
            res = await accionCrearProducto(datos);
        }

        setCargando(false);

        if (!res.exito) {
            setError(res.mensaje);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {productoAEditar ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                required minLength={2}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                required
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            {categorias.length === 0 && (
                                <p className="text-xs text-amber-400 mt-1">No hay categorías activas. Crea una primero.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código de Barra</label>
                            <input
                                type="text"
                                value={codigoBarra}
                                onChange={(e) => setCodigoBarra(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        <div className="hidden md:block"></div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio Compra</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={precioCompra}
                                onChange={(e) => setPrecioCompra(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio Venta</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={precioVenta}
                                onChange={(e) => setPrecioVenta(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Actual</label>
                            <input
                                type="number" min="0"
                                value={stockActual}
                                onChange={(e) => setStockActual(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Mínimo</label>
                            <input
                                type="number" min="0"
                                value={stockMinimo}
                                onChange={(e) => setStockMinimo(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                rows={2}
                            />
                        </div>

                        {/* Sección Farmacia */}
                        <div className="md:col-span-2 mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 mb-4">Datos Farmacéuticos (Opcional)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Principio Activo</label>
                                    <input
                                        type="text" value={principioActivo} onChange={(e) => setPrincipioActivo(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                        placeholder="Ej. Paracetamol"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Laboratorio</label>
                                    <input
                                        type="text" value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                        placeholder="Ej. Bayer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentación</label>
                                    <input
                                        type="text" value={presentacion} onChange={(e) => setPresentacion(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                        placeholder="Ej. Caja x 100 comp."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Concentración</label>
                                    <input
                                        type="text" value={concentracion} onChange={(e) => setConcentracion(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                        placeholder="Ej. 500mg"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center mt-2">
                                    <input
                                        type="checkbox" id="receta" checked={requiereReceta} onChange={(e) => setRequiereReceta(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-teal-600 focus:ring-teal-600 focus:ring-offset-slate-900"
                                    />
                                    <label htmlFor="receta" className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Requiere receta médica para su venta
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition"
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando || categorias.length === 0}
                            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-teal-700 dark:hover:bg-teal-500 transition disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ListaProductos({ productos, categorias, totalPages }: { productos: ProductoCliente[], categorias: Categoria[], totalPages: number }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState<ProductoCliente | null>(null);

    const handleCrear = () => {
        setProductoAEditar(null);
        setMostrarModal(true);
    };

    const handleEditar = (producto: ProductoCliente) => {
        setProductoAEditar(producto);
        setMostrarModal(true);
    };

    const handleCambiarEstado = async (id: number, estadoActual: EstadoRegistro) => {
        if (!confirm(`¿Estás seguro de ${estadoActual === "ACTIVO" ? "desactivar" : "reactivar"} este producto?`)) return;
        
        const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        await accionCambiarEstadoProducto(id, nuevoEstado as EstadoRegistro);
    };

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productos</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Gestiona el catálogo de productos y su stock.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Buscador placeholder="Buscar por nombre, activo, lab..." />
                    <button
                        onClick={handleCrear}
                        className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition whitespace-nowrap"
                    >
                        + Nuevo Producto
                    </button>
                </div>
            </header>

            <div className="app-table-wrapper">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[800px]">
                    <thead className="app-table-head">
                        <tr>
                            <th className="app-table-cell font-semibold">Producto</th>
                            <th className="app-table-cell font-semibold">Categoría</th>
                            <th className="app-table-cell font-semibold">Precio V.</th>
                            <th className="app-table-cell font-semibold">Stock</th>
                            <th className="app-table-cell font-semibold">Estado</th>
                            <th className="app-table-cell font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id} className="app-table-row">
                                    <td className="app-table-cell">
                                        <div className="font-medium text-slate-900 dark:text-white">{prod.nombre} {prod.concentracion ? `(${prod.concentracion})` : ''}</div>
                                        {prod.principioActivo && <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">{prod.principioActivo}</div>}
                                        {prod.laboratorio && <div className="text-xs text-slate-500 dark:text-slate-600 dark:text-slate-400">{prod.laboratorio}</div>}
                                        {prod.codigoBarra && <div className="text-xs text-slate-500 dark:text-slate-600 dark:text-slate-400 mt-1">Cod: {prod.codigoBarra}</div>}
                                        {prod.requiereReceta && <span className="inline-flex mt-1 items-center rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20">Receta Obligatoria</span>}
                                    </td>
                                    <td className="app-table-cell">{prod.categoria?.nombre || "-"}</td>
                                    <td className="app-table-cell font-medium text-teal-600 dark:text-teal-400">
                                        Bs {prod.precioVenta.toFixed(2)}
                                    </td>
                                    <td className="app-table-cell">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-medium ${prod.stockActual <= prod.stockMinimo ? 'text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {prod.stockActual} <span className="text-xs opacity-70 text-slate-600 dark:text-slate-400">Gral.</span>
                                            </span>
                                            {prod.lotes && prod.lotes.length > 0 && (
                                                <div className="flex flex-col mt-1 gap-1">
                                                    {prod.lotes.filter(l => l.stockActual > 0).map(l => {
                                                        const isVencido = new Date(l.fechaVencimiento) < new Date();
                                                        return (
                                                            <div key={l.id} className="text-[10px] bg-slate-100 dark:bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded flex justify-between border border-slate-200 dark:border-slate-300 dark:border-slate-700/50">
                                                                <span className="text-slate-600 dark:text-slate-400">Lote: {l.numeroLote}</span>
                                                                <span className={isVencido ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                                                    {l.stockActual} u.
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="app-table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            prod.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {prod.estado}
                                        </span>
                                    </td>
                                    <td className="app-table-cell text-right">
                                        <button
                                            onClick={() => handleEditar(prod)}
                                            className="text-teal-600 dark:text-teal-400 hover:text-cyan-300 mr-4 transition font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleCambiarEstado(prod.id, prod.estado)}
                                            className={`${
                                                prod.estado === "ACTIVO" ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"
                                            } transition font-medium`}
                                        >
                                            {prod.estado === "ACTIVO" ? "Desactivar" : "Reactivar"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Paginacion totalPages={totalPages} />
            )}

            {mostrarModal && (
                <FormularioProducto 
                    productoAEditar={productoAEditar} 
                    categorias={categorias}
                    onClose={() => setMostrarModal(false)} 
                />
            )}
        </div>
    );
}
