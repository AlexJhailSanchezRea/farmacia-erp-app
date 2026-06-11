import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { AutoLogout } from "@/components/layout/AutoLogout";
import { servicioObtenerReporteGeneral } from "@/modules/reportes/services";
import { DashboardSidebar } from "./DashboardSidebar";
import { verificarAccesoModulo, ModuloNombre } from "@/lib/permissions";

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
  { nombre: "Alertas Sanitarias", ruta: "/alertas" },
  { nombre: "Usuarios y Roles", ruta: "/usuarios" },
  { nombre: "Configuracion", ruta: "/configuracion" },
  { nombre: "Auditoria", ruta: "/auditoria" },
  { nombre: "Facturación Demo", ruta: "/facturas" }
];

export default async function Inicio() {
  const usuario = await obtenerUsuarioAutenticado();
  const reporte = await servicioObtenerReporteGeneral();

  // Filtrar módulos según permisos del rol
  const modulosPermitidos = usuario 
    ? modulos.filter(m => verificarAccesoModulo(usuario.rol.nombre, m.nombre as ModuloNombre))
    : [];

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
      titulo: "Compras del Mes",
      valor: formatSoles(reporte.resumen.comprasTotalesMes),
      descripcion: "Inversión registrada",
    },
    {
      titulo: "Productos Activos",
      valor: reporte.resumen.productosActivos.toString(),
      descripcion: "Disponibles en el catálogo",
    },
    {
      titulo: "Stock Bajo",
      valor: reporte.resumen.productosStockBajo.toString(),
      descripcion: "Debajo del mínimo permitido",
    },
    {
      titulo: "Alertas Vencimiento",
      valor: reporte.resumen.alertasVencimiento.toString(),
      descripcion: "Lotes vencidos o próximos a 30 días",
    },
  ];

  if (!usuario) {
    return <AutoLogout />;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row">
      <DashboardSidebar 
        modulosPermitidos={modulosPermitidos}
        usuarioInfo={
          usuario && (
            <div className="flex items-center gap-3 px-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center border border-slate-700 dark:border-slate-600">
                    <span className="text-white font-bold">{usuario.nombre.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{usuario.nombre}</p>
                    <p className="text-xs text-slate-400">{usuario.rol.nombre}</p>
                </div>
            </div>
          )
        }
        logoutButton={<LogoutButton />}
      />

      <section className="flex-1 p-6 lg:p-10 w-full lg:w-auto">
          <header className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Sistema ERP Modular
            </p>

            <div className="mt-4 max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Bienvenido a PharmaERP 360
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                Plataforma corporativa para gestionar ventas, compras, inventario,
                clientes, proveedores, caja, comprobantes y reportes. Optimizado para el 
                control riguroso del sector farmacéutico.
              </p>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
            {indicadores.map((indicador) => (
              <article
                key={indicador.titulo}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {indicador.titulo}
                </p>
                <strong className="mt-3 block text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {indicador.valor}
                </strong>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {indicador.descripcion}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Arquitectura del sistema
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                PharmaERP 360 se desarrolla bajo una arquitectura en capas con
                organización modular. La presentación, la lógica de negocio y el
                acceso a datos se mantienen separados para facilitar la
                auditoría y escalabilidad.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Especialización Clínica
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Incorpora trazabilidad completa mediante lotes,
                vencimientos, laboratorios, alertas tempranas y rotación FEFO para controlar
                rigurosamente los productos críticos.
              </p>
            </article>
          </section>
        </section>
    </main>
  );
}