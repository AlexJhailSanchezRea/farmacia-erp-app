"use client";

import { useState } from "react";
import { VentaCliente, DetalleVentaInput } from "@/modules/ventas/types";
import { accionCrearVenta, accionAnularVenta } from "@/modules/ventas/actions";
import { accionGenerarFacturaDemo } from "@/modules/facturas/actions";
import { ClienteCliente } from "@/modules/clientes/types";
import { ProductoCliente } from "@/modules/productos/types";

export function FormularioVenta({
    clientes,
    productos,
    onClose
}: {
    clientes: ClienteCliente[];
    productos: ProductoCliente[];
    onClose: () => void;
}) {
    const [clienteId, setClienteId] = useState<number>(0);
    const [observacion, setObservacion] = useState("");
    const [detalles, setDetalles] = useState<DetalleVentaInput[]>([]);
    
    // Selectores temporales
    const [productoSelec, setProductoSelec] = useState<number>(0);
    const [cantidadSelec, setCantidadSelec] = useState<number>(1);
    const [precioSelec, setPrecioSelec] = useState<number>(0);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const clientesActivos = clientes.filter(c => c.estado === "ACTIVO");
    const productosActivos = productos.filter(p => p.estado === "ACTIVO" && p.stockActual > 0);

    const handleSelectProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setProductoSelec(id);
        if (id > 0) {
            const prod = productos.find(p => p.id === id);
            if (prod) {
                setPrecioSelec(prod.precioVenta);
                setCantidadSelec(1);
            }
        } else {
            setPrecioSelec(0);
        }
    };

    const agregarDetalle = () => {
        if (!productoSelec || cantidadSelec <= 0 || precioSelec < 0) return;
        
        const prod = productos.find(p => p.id === productoSelec);
        if (!prod) return;

        if (detalles.find(d => d.productoId === productoSelec)) {
            setError("El producto ya fue agregado al detalle.");
            return;
        }

        if (cantidadSelec > prod.stockActual) {
            setError(`Stock insuficiente. Solo hay ${prod.stockActual} disponibles.`);
            return;
        }

        setDetalles([
            ...detalles, 
            { productoId: productoSelec, cantidad: cantidadSelec, precioUnitario: precioSelec }
        ]);
        setProductoSelec(0);
        setCantidadSelec(1);
        setPrecioSelec(0);
        setError("");
    };

    const quitarDetalle = (prodId: number) => {
        setDetalles(detalles.filter(d => d.productoId !== prodId));
    };

    const calcularTotal = () => {
        return detalles.reduce((acc, curr) => acc + (curr.cantidad * curr.precioUnitario), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (detalles.length === 0) {
            setError("Debe añadir al menos un producto a la venta.");
            return;
        }

        setCargando(true);

        const res = await accionCrearVenta({
            clienteId: clienteId > 0 ? clienteId : undefined,
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Nueva Venta</h3>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
                        <select
                            value={clienteId}
                            onChange={(e) => setClienteId(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value={0}>Cliente General (Sin registro)</option>
                            {clientesActivos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre} {c.ciNit ? `(CI/NIT: ${c.ciNit})` : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observación</label>
                        <input
                            type="text"
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Ej. Entregado en mostrador"
                        />
                    </div>
                </div>

                {/* Zona de adición de productos */}
                <div className="hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-300 dark:border-slate-700 mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Agregar Producto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Producto (Stock disponible)</label>
                            <select
                                value={productoSelec}
                                onChange={handleSelectProducto}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value={0}>-- Seleccionar Producto --</option>
                                {productosActivos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} (Dispo: {p.stockActual})</option>
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
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Precio Venta (Bs)</label>
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={precioSelec}
                                onChange={(e) => setPrecioSelec(Number(e.target.value))}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            onClick={agregarDetalle}
                            className="rounded-lg bg-indigo-600/20 text-indigo-400 px-4 py-2 text-sm font-medium hover:bg-indigo-600/40 border border-indigo-500/30 transition"
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
                                <th className="px-4 py-3">Producto</th>
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
                                        <tr key={d.productoId} className="bg-white dark:bg-white dark:bg-slate-900/50">
                                            <td className="px-4 py-3 text-slate-900 dark:text-white">{prod?.nombre}</td>
                                            <td className="px-4 py-3 text-right">{d.cantidad}</td>
                                            <td className="px-4 py-3 text-right">Bs {d.precioUnitario.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-medium text-indigo-400">Bs {(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => quitarDetalle(d.productoId)} className="text-red-400 hover:text-red-300" type="button">X</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right">TOTAL VENTA:</td>
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
                        disabled={cargando || detalles.length === 0}
                        className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-indigo-500 transition disabled:opacity-50"
                    >
                        {cargando ? "Registrando Venta..." : "Registrar Venta"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ModalAnularVenta({
    venta,
    onClose
}: {
    venta: VentaCliente;
    onClose: () => void;
}) {
    const [motivo, setMotivo] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!motivo.trim()) {
            setError("El motivo de anulación es obligatorio.");
            return;
        }

        setCargando(true);
        const res = await accionAnularVenta(venta.id, motivo);
        setCargando(false);

        if (!res.exito) {
            setError(res.mensaje);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl border border-red-700/50 bg-white dark:bg-slate-900 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-red-400 mb-4">Anular Venta {venta.numeroVenta}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Esta acción devolverá el stock, registrará un movimiento de caja en egreso y marcará el comprobante como anulado. No se puede deshacer.
                </p>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Motivo de la anulación <span className="text-red-400">*</span></label>
                    <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Ej. Error en el registro de productos"
                        rows={3}
                        required
                    />
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
                        disabled={cargando || !motivo.trim()}
                        className="rounded-xl bg-red-600 px-6 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-red-500 transition disabled:opacity-50"
                    >
                        {cargando ? "Anulando..." : "Confirmar Anulación"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ListaVentas({ 
    ventas, 
    clientes, 
    productos,
    puedeAnular,
    cajaAbierta
}: { 
    ventas: VentaCliente[];
    clientes: ClienteCliente[];
    productos: ProductoCliente[];
    puedeAnular?: boolean;
    cajaAbierta?: boolean;
}) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ventaParaAnular, setVentaParaAnular] = useState<VentaCliente | null>(null);

    return (
        <div className="flex-1 p-6 lg:p-10">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ventas</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Registra salidas de mercadería y emite comprobantes.</p>
                </div>
                <button
                    onClick={() => {
                        if (!cajaAbierta) {
                            alert("Debe abrir caja antes de registrar una venta.");
                            return;
                        }
                        setMostrarModal(true);
                    }}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-indigo-500 transition whitespace-nowrap disabled:opacity-50"
                >
                    + Registrar Venta
                </button>
            </header>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white dark:bg-slate-900/50 overflow-hidden shadow-xl overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[900px]">
                    <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white dark:bg-slate-900/80 text-xs uppercase text-slate-600 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nro. Venta</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Observación</th>
                            <th className="px-6 py-4 font-semibold text-right">Total</th>
                            <th className="px-6 py-4 font-semibold text-center">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Factura Demo</th>
                            {puedeAnular && <th className="px-6 py-4 font-semibold text-center">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {ventas.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-600 dark:text-slate-400">
                                    No hay ventas registradas.
                                </td>
                            </tr>
                        ) : (
                            ventas.map((v) => (
                                <tr key={v.id} className="hover:hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-slate-800/50 transition">
                                    <td className="px-6 py-4 font-mono text-indigo-400 font-medium">
                                        {v.numeroVenta}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(v.fechaVenta).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {v.cliente ? v.cliente.nombre : "Cliente General"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {v.observacion || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                                        Bs {v.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            v.estado === "ACTIVO" 
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {v.estado === "ACTIVO" ? "ACTIVA" : "ANULADA"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {v.facturaDemoId ? (
                                            <a 
                                                href={`/facturas/${v.facturaDemoId}`} 
                                                className="inline-block rounded-lg bg-teal-600/20 px-3 py-1 text-xs font-medium text-teal-400 hover:bg-teal-600/40 border border-teal-500/30 transition"
                                            >
                                                Ver Factura
                                            </a>
                                        ) : v.estado === "ACTIVO" && (
                                            <button
                                                onClick={async () => {
                                                    const res = await accionGenerarFacturaDemo(v.id);
                                                    if (!res.exito) alert(res.error);
                                                }}
                                                className="inline-block rounded-lg bg-indigo-600/20 px-3 py-1 text-xs font-medium text-indigo-400 hover:bg-indigo-600/40 border border-indigo-500/30 transition"
                                            >
                                                Generar
                                            </button>
                                        )}
                                    </td>
                                    {puedeAnular && (
                                        <td className="px-6 py-4 text-center">
                                            {v.estado === "ACTIVO" && (
                                                <button
                                                    onClick={() => {
                                                        if (!cajaAbierta) {
                                                            alert("Debe abrir caja antes de anular una venta.");
                                                            return;
                                                        }
                                                        setVentaParaAnular(v);
                                                    }}
                                                    className="text-xs font-medium text-red-400 hover:text-red-300 transition underline underline-offset-2 disabled:opacity-50"
                                                >
                                                    Anular
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {mostrarModal && (
                <FormularioVenta 
                    clientes={clientes} 
                    productos={productos} 
                    onClose={() => setMostrarModal(false)} 
                />
            )}

            {ventaParaAnular && (
                <ModalAnularVenta
                    venta={ventaParaAnular}
                    onClose={() => setVentaParaAnular(null)}
                />
            )}
        </div>
    );
}
