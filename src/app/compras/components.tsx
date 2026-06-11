"use client";

import { useState } from "react";
import { CompraCliente, DetalleCompraInput } from "@/modules/compras/types";
import { accionCrearCompra } from "@/modules/compras/actions";
import { ProveedorCliente } from "@/modules/proveedores/types";
import { ProductoCliente } from "@/modules/productos/types";

export function FormularioCompra({
    proveedores,
    productos,
    onClose
}: {
    proveedores: ProveedorCliente[];
    productos: ProductoCliente[];
    onClose: () => void;
}) {
    const [proveedorId, setProveedorId] = useState<number>(0);
    const [observacion, setObservacion] = useState("");
    const [detalles, setDetalles] = useState<DetalleCompraInput[]>([]);
    
    const [productoSelec, setProductoSelec] = useState<number>(0);
    const [cantidadSelec, setCantidadSelec] = useState<number>(1);
    const [precioSelec, setPrecioSelec] = useState<number>(0);
    const [loteSelec, setLoteSelec] = useState("");
    const [fechaVencimientoSelec, setFechaVencimientoSelec] = useState("");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const proveedoresActivos = proveedores.filter(p => p.estado === "ACTIVO");
    const productosActivos = productos.filter(p => p.estado === "ACTIVO");

    const agregarDetalle = () => {
        if (!productoSelec || cantidadSelec <= 0 || precioSelec < 0) return;
        if (!loteSelec.trim() || !fechaVencimientoSelec) {
            setError("Debe especificar el número de lote y fecha de vencimiento del producto.");
            return;
        }
        
        // Evitar duplicados en el detalle (del mismo lote)
        if (detalles.find(d => d.productoId === productoSelec && d.numeroLote === loteSelec)) {
            setError("El producto con este lote ya fue agregado al detalle.");
            return;
        }

        setDetalles([
            ...detalles, 
            { 
                productoId: productoSelec, 
                cantidad: cantidadSelec, 
                precioUnitario: precioSelec,
                numeroLote: loteSelec.trim().toUpperCase(),
                fechaVencimiento: fechaVencimientoSelec
            }
        ]);
        setProductoSelec(0);
        setCantidadSelec(1);
        setPrecioSelec(0);
        setLoteSelec("");
        setFechaVencimientoSelec("");
        setError("");
    };

    const quitarDetalle = (prodId: number, numLote: string) => {
        setDetalles(detalles.filter(d => !(d.productoId === prodId && d.numeroLote === numLote)));
    };

    const calcularTotal = () => {
        return detalles.reduce((acc, curr) => acc + (curr.cantidad * curr.precioUnitario), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (proveedorId === 0) {
            setError("Debe seleccionar un proveedor.");
            return;
        }

        if (detalles.length === 0) {
            setError("Debe añadir al menos un producto a la compra.");
            return;
        }

        setCargando(true);

        const res = await accionCrearCompra({
            proveedorId,
            observacion,
            detalles
        });

        setCargando(false);

        if (!res.exito) {
            setError(res.mensaje);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-4xl rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Nueva Compra</h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Proveedor *</label>
                        <select
                            value={proveedorId}
                            onChange={(e) => setProveedorId(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            <option value={0}>-- Seleccionar Proveedor --</option>
                            {proveedoresActivos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} {p.nit ? `(NIT: ${p.nit})` : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observación</label>
                        <input
                            type="text"
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            placeholder="Ej. Factura Nro 12345"
                        />
                    </div>
                </div>

                {/* Zona de adición de productos */}
                <div className="hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-300 dark:border-slate-700 mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Agregar Producto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Producto</label>
                            <select
                                value={productoSelec}
                                onChange={(e) => setProductoSelec(Number(e.target.value))}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value={0}>-- Seleccionar Producto --</option>
                                {productosActivos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Cantidad</label>
                            <input
                                type="number"
                                min={1}
                                value={cantidadSelec}
                                onChange={(e) => setCantidadSelec(Number(e.target.value))}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Precio Unitario (Bs)</label>
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={precioSelec}
                                onChange={(e) => setPrecioSelec(Number(e.target.value))}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
                        <div>
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Nro. Lote (Obligatorio)</label>
                            <input
                                type="text"
                                value={loteSelec}
                                onChange={(e) => setLoteSelec(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                                placeholder="Lote del producto"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Vencimiento (Obligatorio)</label>
                            <input
                                type="date"
                                value={fechaVencimientoSelec}
                                onChange={(e) => setFechaVencimientoSelec(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={agregarDetalle}
                            className="rounded-lg bg-emerald-600/20 text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-600/40 border border-emerald-500/30 transition"
                        >
                            + Añadir al Detalle
                        </button>
                    </div>
                </div>

                {/* Tabla de detalle */}
                <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 mb-6">
                    <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Producto / Lote</th>
                                <th className="px-4 py-3 text-right">Cant.</th>
                                <th className="px-4 py-3 text-right">P. Unitario</th>
                                <th className="px-4 py-3 text-right">Subtotal</th>
                                <th className="px-4 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {detalles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                        No hay productos añadidos.
                                    </td>
                                </tr>
                            ) : (
                                detalles.map((d) => {
                                    const prod = productos.find(p => p.id === d.productoId);
                                    return (
                                        <tr key={`${d.productoId}-${d.numeroLote}`} className="bg-white dark:bg-white dark:bg-slate-900/50">
                                            <td className="px-4 py-3">
                                                <div className="text-slate-900 dark:text-white font-medium">{prod?.nombre}</div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Lote: <span className="text-teal-600 dark:text-teal-400">{d.numeroLote}</span> | Vence: {new Date(d.fechaVencimiento).toLocaleDateString('es-ES', { timeZone: 'UTC'})}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right">{d.cantidad}</td>
                                            <td className="px-4 py-3 text-right">Bs {d.precioUnitario.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-medium text-teal-600 dark:text-teal-400">Bs {(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => quitarDetalle(d.productoId, d.numeroLote)} className="text-red-400 hover:text-red-300" type="button">X</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right">TOTAL COMPRA:</td>
                                <td className="px-4 py-3 text-right text-emerald-400 text-lg">Bs {calcularTotal().toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 transition"
                        disabled={cargando}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={cargando || detalles.length === 0 || proveedorId === 0}
                        className="rounded-xl bg-teal-600 px-6 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-teal-700 dark:hover:bg-teal-500 transition disabled:opacity-50"
                    >
                        {cargando ? "Registrando Compra..." : "Registrar Compra"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ListaCompras({ 
    compras, 
    proveedores, 
    productos 
}: { 
    compras: CompraCliente[];
    proveedores: ProveedorCliente[];
    productos: ProductoCliente[];
}) {
    const [mostrarModal, setMostrarModal] = useState(false);

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Compras</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Registra ingresos de mercadería al inventario.</p>
                </div>
                <button
                    onClick={() => setMostrarModal(true)}
                    className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition whitespace-nowrap"
                >
                    + Registrar Compra
                </button>
            </header>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white dark:bg-slate-900/50 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[900px]">
                    <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white dark:bg-slate-900/80 text-xs uppercase text-slate-600 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nro. Compra</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Proveedor</th>
                            <th className="px-6 py-4 font-semibold">Observación</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {compras.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay compras registradas.
                                </td>
                            </tr>
                        ) : (
                            compras.map((comp) => (
                                <tr key={comp.id} className="hover:hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-mono text-teal-600 dark:text-teal-400 font-medium">
                                        {comp.numeroCompra}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(comp.fechaCompra).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {comp.proveedor?.nombre}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {comp.observacion || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                                        Bs {comp.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            comp.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {comp.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {mostrarModal && (
                <FormularioCompra 
                    proveedores={proveedores} 
                    productos={productos} 
                    onClose={() => setMostrarModal(false)} 
                />
            )}
        </div>
    );
}
