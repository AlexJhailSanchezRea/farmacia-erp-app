"use client";

import { FacturaConDetalles } from "@/modules/facturas/types";
import { ConfiguracionSistema } from "@/modules/configuracion/types";
import Link from "next/link";

export function VistaImpresionFactura({ 
    factura, 
    configuracion
}: { 
    factura: FacturaConDetalles; 
    configuracion: ConfiguracionSistema | null;
}) {
    const handleImprimir = () => {
        window.print();
    };

    const clienteNombre = factura.venta.cliente?.nombre || "Cliente General";
    const clienteNIT = factura.venta.cliente?.ciNit || "No registrado";
    
    // Valores de la farmacia o defaults
    const farmaNombre = configuracion?.nombreComercial || "Farmacia Demo";
    const farmaRazon = configuracion?.razonSocial || "Farmacia Demo S.R.L.";
    const farmaNIT = configuracion?.nit || "0000000000";
    const farmaDir = configuracion?.direccion || "Av. Principal #123";
    const farmaTel = configuracion?.telefono || "12345678";
    const farmaCiudad = configuracion?.ciudad || "Ciudad Demo";

    return (
        <div className="w-full max-w-[800px] flex flex-col gap-6 print:gap-0">
            {/* Controles no imprimibles */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 print:hidden">
                <div>
                    <Link href="/facturas" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition">
                        &larr; Volver a Facturas Demo
                    </Link>
                </div>
                <button
                    onClick={handleImprimir}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition"
                >
                    🖨️ Imprimir Factura Demo
                </button>
            </div>

            {/* Hoja de impresión */}
            <div className="relative bg-white p-10 rounded-none md:rounded-2xl shadow-xl print:shadow-none print:p-0 print:m-0 text-black border border-slate-200 print:border-none">
                
                {/* MARCA DE AGUA PARA MODO DEMO */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-[0.05] print:opacity-[0.1]">
                    <div className="text-[100px] font-black text-black transform -rotate-45 whitespace-nowrap">
                        DOCUMENTO DEMO
                    </div>
                </div>

                <div className="relative z-10">
                    {/* ENCABEZADO TIPO FACTURA */}
                    <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-black pb-6 mb-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-black uppercase mb-1">{farmaNombre}</h1>
                            <div className="text-xs space-y-0.5">
                                <p className="font-bold">{farmaRazon}</p>
                                <p>Casa Matriz</p>
                                <p>Dir: {farmaDir}</p>
                                <p>Tel: {farmaTel}</p>
                                <p>{farmaCiudad} - Bolivia</p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 md:text-right border-2 border-black rounded-xl p-4 w-full md:w-auto text-center">
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm">
                                <div className="text-left md:text-right">
                                    <span className="font-bold block text-xs">NIT</span>
                                    <span>{farmaNIT}</span>
                                </div>
                                <div className="text-left md:text-right">
                                    <span className="font-bold block text-xs">FACTURA N°</span>
                                    <span className="text-lg text-red-600 font-bold">{factura.numeroFactura}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-wider">Factura</h2>
                        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">(Con Derecho a Crédito Fiscal) - SIMULACIÓN</span>
                    </div>

                    {/* DATOS DEL CLIENTE Y TRANSACCIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 bg-slate-50 print:bg-white p-4 border border-slate-300 rounded-lg">
                        <div>
                            <p className="mb-1"><span className="font-bold mr-2">Fecha:</span> {new Date(factura.fechaEmision).toLocaleString('es-ES')}</p>
                            <p className="mb-1"><span className="font-bold mr-2">Señor(es):</span> {clienteNombre}</p>
                        </div>
                        <div>
                            <p className="mb-1"><span className="font-bold mr-2">NIT/CI/CEX:</span> {clienteNIT}</p>
                            <p className="mb-1"><span className="font-bold mr-2">Cód. Cliente:</span> {factura.venta.clienteId || '0'}</p>
                        </div>
                    </div>

                    {/* DETALLE DE PRODUCTOS */}
                    <div className="mb-6">
                        <table className="w-full text-sm text-left border-collapse border border-slate-300">
                            <thead className="bg-slate-100 print:bg-slate-100 font-bold">
                                <tr>
                                    <th className="border border-slate-300 px-3 py-2 text-center w-16">CANT.</th>
                                    <th className="border border-slate-300 px-3 py-2">DESCRIPCIÓN</th>
                                    <th className="border border-slate-300 px-3 py-2 text-right w-24">P. UNIT (Bs)</th>
                                    <th className="border border-slate-300 px-3 py-2 text-right w-24">SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.venta.detalles.map((d, index) => (
                                    <tr key={index}>
                                        <td className="border border-slate-300 px-3 py-2 text-center">{d.cantidad}</td>
                                        <td className="border border-slate-300 px-3 py-2">{d.producto.nombre}</td>
                                        <td className="border border-slate-300 px-3 py-2 text-right">{Number(d.precioUnitario).toFixed(2)}</td>
                                        <td className="border border-slate-300 px-3 py-2 text-right">{Number(d.subtotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="border border-slate-300 px-3 py-2 text-right font-bold">TOTAL BS:</td>
                                    <td className="border border-slate-300 px-3 py-2 text-right font-bold bg-slate-100">{Number(factura.total).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* PIE DE FACTURA (SIAT) */}
                    <div className="border-t border-black pt-4">
                        <div className="text-[10px] space-y-2 mb-4">
                            <p><strong>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS, EL USO ILÍCITO DE ÉSTA SERÁ SANCIONADO DE ACUERDO A LEY</strong></p>
                            <p>{factura.leyenda}</p>
                            <p className="text-center font-bold">&quot;Este documento es la Representación Gráfica de un Documento Fiscal Digital emitido en una modalidad de facturación en línea&quot;</p>
                        </div>

                        <div className="bg-red-50 text-red-700 border border-red-300 p-3 rounded-lg text-center font-bold mt-4 print:border-black print:text-black">
                            DOCUMENTO DEMO - NO VÁLIDO PARA CRÉDITO FISCAL
                        </div>
                    </div>

                    {/* MARCA DE ANULADA */}
                    {factura.estado === "INACTIVO" && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                            <div className="border-4 border-red-600 px-8 py-4 transform -rotate-12 bg-white/80">
                                <span className="text-6xl font-black text-red-600 tracking-widest uppercase">Anulada</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
