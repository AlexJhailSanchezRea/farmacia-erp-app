import Link from "next/link";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { servicioObtenerReporteGeneral } from "@/modules/reportes/services";

const modulos = [
  { nombre: "Productos", ruta: "/productos" },
  { nombre: "Categorías", ruta: "/categorias" },
  { nombre: "Clientes", ruta: "/clientes" },
  { nombre: "Proveedores", ruta: "/proveedores" },
  { nombre: "Compras", ruta: "/compras" },
  { nombre: "Ventas", ruta: "/ventas" },
  { nombre: "Inventario", ruta: "/inventario" },
  { nombre: "Caja", ruta: "/caja" },
  { nombre: "Reportes", ruta: "/reportes" },
  { nombre: "Comprobantes", ruta: "/comprobantes" },
  { nombre: "Usuarios y Roles", ruta: "/usuarios" }
];

export default async function Inicio() {
  const usuario = await obtenerUsuarioAutenticado();
  const reporte = await servicioObtenerReporteGeneral();

  const formatSoles = (valor: number) => `Bs ${valor.toFixed(2)}`;

  const indicadores = [
    {
      titulo: "Ventas del Mes",
      valor: formatSoles(reporte.resumen.ventasTotalesMes),
      descripcion: "Ingresos registrados este mes",
    },
    {
      titulo: "Saldo en Caja",
      valor: formatSoles(reporte.resumen.saldoCaja),
      descripcion: "Efectivo disponible derivado",
    },
    {
      titulo: "Stock bajo",
      valor: reporte.resumen.productosStockBajo.toString(),
      descripcion: "Productos por debajo del mínimo",
    },
    {
      titulo: "Compras del Mes",
      valor: formatSoles(reporte.resumen.comprasTotalesMes),
      descripcion: "Inversión registrada este mes",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-800 bg-slate-900/80 p-6 lg:block">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
              NexaERP
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">
              Panel administrativo
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              ERP modular para pequeños y medianos negocios.
            </p>
          </div>

          <nav className="space-y-2">
            {modulos.map((modulo) => (
              <Link
                key={modulo.nombre}
                href={modulo.ruta}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {modulo.nombre}
              </Link>
            ))}
          </nav>
          
          {usuario && (
            <div className="mt-8 border-t border-slate-800 pt-6">
                <div className="flex items-center gap-3 px-4 mb-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <span className="text-indigo-300 font-bold">{usuario.nombre.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{usuario.nombre}</p>
                        <p className="text-xs text-slate-400">{usuario.rol.nombre}</p>
                    </div>
                </div>
                <LogoutButton />
            </div>
          )}
        </aside>

        <section className="flex-1 p-6 lg:p-10">
          <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Sistema ERP modular
            </p>

            <div className="mt-4 max-w-4xl">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                Bienvenido a NexaERP
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Plataforma base para gestionar ventas, compras, inventario,
                clientes, proveedores, caja, comprobantes y reportes. El sistema
                está preparado para adaptarse a distintos rubros comerciales.
              </p>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {indicadores.map((indicador) => (
              <article
                key={indicador.titulo}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm font-medium text-slate-400">
                  {indicador.titulo}
                </p>
                <strong className="mt-3 block text-3xl font-bold text-white">
                  {indicador.valor}
                </strong>
                <p className="mt-2 text-sm text-slate-500">
                  {indicador.descripcion}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold text-white">
                Arquitectura del sistema
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                NexaERP se desarrolla bajo una arquitectura en capas con
                organización modular. La presentación, la lógica de negocio y el
                acceso a datos se mantienen separados para facilitar el
                mantenimiento y la reutilización.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold text-white">
                Primera especialización
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                La primera adaptación será para farmacia, incorporando lotes,
                vencimientos, laboratorios, alertas y lógica FEFO para controlar
                productos próximos a vencer.
              </p>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}