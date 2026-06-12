import { accionObtenerComprobantePorId } from "@/modules/comprobantes/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BotonImprimir } from "./components";
import { verificarAccesoModulo } from "@/lib/permissions";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { accionObtenerConfiguracion } from "@/modules/configuracion/actions";

export default async function DetalleComprobantePage({ params }: { params: { id: string } }) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario) {
        redirect('/login');
    }
    
    if (!verificarAccesoModulo(usuario.rol.nombre, 'Comprobantes')) {
        redirect('/');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        notFound();
    }

    const [comprobante, config] = await Promise.all([
        accionObtenerComprobantePorId(id),
        accionObtenerConfiguracion()
    ]);

    if (!comprobante) {
        notFound();
    }

    return (
        <div className="flex-1 p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex justify-between items-center print:hidden">
                    <Link href="/comprobantes" className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center gap-1">
                        &larr; Volver a comprobantes
                    </Link>
                    <BotonImprimir />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 print:p-0 print:bg-white print:shadow-none print:border-none print:m-0 w-full relative overflow-hidden" id="area-impresion">
                    
                    {comprobante.estado === 'INACTIVO' && (
                        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none select-none print:opacity-30">
                            <span className="text-8xl font-black text-red-600 transform -rotate-45 tracking-widest border-8 border-red-600 px-8 py-4 rounded-3xl">ANULADO</span>
                        </div>
                    )}
                    
                    {/* Contenedor relativo para estar por encima del watermark */}
                    <div className="relative z-10">
                        {/* Header Recibo */}
                    <div className="text-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-slate-800">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest print:text-black">{config.nombreComercial}</h1>
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-1 print:text-black">{config.razonSocial}</h2>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1 print:text-black">
                            <p>NIT: {config.nit}</p>
                            <p>Dirección: {config.direccion}</p>
                            <p>Teléfono: {config.telefono}</p>
                        </div>
                    </div>

                    {/* Meta Recibo */}
                    <div className="flex justify-between items-start mb-8 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                        <div>
                            <p><span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">Nro. Comprobante:</span> {comprobante.numeroComprobante}</p>
                            <p><span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">Tipo:</span> {comprobante.tipoComprobante.replace('_', ' ')}</p>
                            <p><span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">Fecha:</span> {new Date(comprobante.fechaEmision).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">Cliente:</span> {comprobante.clienteNombre}</p>
                            <p><span className="font-semibold text-slate-900 dark:text-slate-100 print:text-black">Vendedor:</span> Usuario del sistema</p>
                        </div>
                    </div>

                    {/* Detalle Productos */}
                    <div className="mb-8">
                        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300 print:text-black">
                            <thead className="border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 print:border-black print:text-black">
                                <tr>
                                    <th className="py-2 font-semibold">Cant.</th>
                                    <th className="py-2 font-semibold">Descripción</th>
                                    <th className="py-2 font-semibold text-right">P. Unit</th>
                                    <th className="py-2 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-400">
                                {comprobante.detalles.map(d => (
                                    <tr key={d.id}>
                                        <td className="py-2 font-mono">{d.cantidad}</td>
                                        <td className="py-2 font-medium">{d.productoNombre}</td>
                                        <td className="py-2 text-right">Bs {d.precioUnitario.toFixed(2)}</td>
                                        <td className="py-2 text-right font-semibold">Bs {d.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totales */}
                    <div className="flex justify-end border-t-2 border-slate-200 dark:border-slate-800 pt-4 print:border-black">
                        <div className="w-1/2">
                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
                                <span>TOTAL:</span>
                                <span>Bs {comprobante.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center text-sm text-slate-600 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-800 print:text-black">
                        <p className="font-semibold text-slate-700 dark:text-slate-300 print:text-black mb-1">{config.mensajeComprobante}</p>
                        <p className="text-xs mt-2 text-slate-400 dark:text-slate-600 dark:text-slate-400 print:text-slate-600">Este no es un documento fiscal</p>
                    </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
