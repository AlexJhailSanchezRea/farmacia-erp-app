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
            categoriaId: idCat
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
            <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl my-8">
                <h3 className="text-xl font-bold text-white mb-4">
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
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                required minLength={2}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                            <select
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
                            <label className="block text-sm font-medium text-slate-300 mb-1">Código de Barra</label>
                            <input
                                type="text"
                                value={codigoBarra}
                                onChange={(e) => setCodigoBarra(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        <div className="hidden md:block"></div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Precio Compra</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={precioCompra}
                                onChange={(e) => setPrecioCompra(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Precio Venta</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={precioVenta}
                                onChange={(e) => setPrecioVenta(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Stock Actual</label>
                            <input
                                type="number" min="0"
                                value={stockActual}
                                onChange={(e) => setStockActual(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Stock Mínimo</label>
                            <input
                                type="number" min="0"
                                value={stockMinimo}
                                onChange={(e) => setStockMinimo(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando || categorias.length === 0}
                            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition disabled:opacity-50"
                        >
                            {cargando ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ListaProductos({ productos, categorias }: { productos: ProductoCliente[], categorias: Categoria[] }) {
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
                    <h1 className="text-3xl font-bold text-white">Productos</h1>
                    <p className="mt-2 text-slate-400">Gestiona el catálogo de productos y su stock.</p>
                </div>
                <button
                    onClick={handleCrear}
                    className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-cyan-500 transition whitespace-nowrap"
                >
                    + Nuevo Producto
                </button>
            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 min-w-[800px]">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Producto</th>
                            <th className="px-6 py-4 font-semibold">Categoría</th>
                            <th className="px-6 py-4 font-semibold">Precio V.</th>
                            <th className="px-6 py-4 font-semibold">Stock</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            productos.map((prod) => (
                                <tr key={prod.id} className="hover:bg-slate-800/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{prod.nombre}</div>
                                        {prod.codigoBarra && <div className="text-xs text-slate-500 mt-1">Cod: {prod.codigoBarra}</div>}
                                    </td>
                                    <td className="px-6 py-4">{prod.categoria?.nombre || "-"}</td>
                                    <td className="px-6 py-4 font-medium text-cyan-400">
                                        Bs {prod.precioVenta.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${prod.stockActual <= prod.stockMinimo ? 'text-amber-400' : 'text-slate-300'}`}>
                                            {prod.stockActual}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            prod.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {prod.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditar(prod)}
                                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition font-medium"
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
