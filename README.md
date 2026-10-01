<div align="center">

# PharmaERP 360

### Gestión farmacéutica, comercial e inventario en una sola plataforma

Aplicación web ERP modular para administrar productos, ventas, compras, caja y operaciones de farmacia, con trazabilidad de lotes y alertas de vencimiento.

<p>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs" alt="Next.js 16" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 17" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma 7" /></a>
</p>

[Ver el repositorio](https://github.com/AlexJhailSanchezRea/farmacia-erp-app) · [Arquitectura](docs/ARCHITECTURE.md) · [Guía de capturas](docs/CAPTURAS_REALES.md)

</div>

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard de PharmaERP 360 con indicadores de ventas, caja, compras, productos y alertas" width="100%" />
</p>

<p align="center"><sub>Dashboard del sistema · Captura real de la aplicación</sub></p>

## Sobre el proyecto

PharmaERP 360 es un proyecto de portafolio enfocado en resolver flujos habituales de una farmacia y un negocio comercial desde una aplicación integrada. Reúne gestión de catálogo, compras, ventas, inventario, caja, comprobantes, reportes y administración de usuarios.

La solución está construida con **Next.js App Router**, **TypeScript**, **PostgreSQL** y **Prisma ORM**. Su organización modular y separación por capas buscan que cada área del negocio pueda mantenerse y ampliarse sin concentrar toda la lógica en las páginas.

## Capacidades principales

| Área | Qué permite gestionar |
| --- | --- |
| **Farmacia e inventario** | Productos farmacéuticos, lotes, vencimientos, stock mínimo, alertas sanitarias y rotación FEFO. |
| **Operación comercial** | Catálogo, categorías, clientes, proveedores, compras y registro de ventas. |
| **Caja** | Apertura y cierre de turno, saldo esperado e historial de movimientos. |
| **Acceso y trazabilidad** | Usuarios, roles, auditoría y control de acceso a los módulos. |
| **Seguimiento** | Indicadores operativos y reportes para consultar ventas, compras, caja y stock crítico. |
| **Comprobantes** | Historial de comprobantes internos y visualización de facturas en modo demostración. |

> **Alcance de facturación:** la factura disponible es demostrativa y no tiene validez fiscal. El proyecto no debe utilizarse como sistema de emisión fiscal sin una integración certificada y el cumplimiento de la normativa aplicable.

## Recorrido visual

Las imágenes siguientes se tomaron de la aplicación real y se guardan en [`docs/screenshots`](docs/screenshots). Los paneles se agrupan por flujo para que la página del repositorio sea fácil de recorrer.

<details>
<summary><strong>01 · Catálogo e inventario farmacéutico</strong></summary>
<br />

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/producto1.png" alt="Catálogo de productos con categoría, precio, stock y estado" /><br /><sub>Catálogo de productos</sub></td>
    <td width="50%"><img src="docs/screenshots/producto2.png" alt="Formulario de producto con datos farmacéuticos" /><br /><sub>Ficha de producto y datos farmacéuticos</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/inventario.png" alt="Historial de movimientos de inventario" /><br /><sub>Movimientos de inventario</sub></td>
    <td width="50%"><img src="docs/screenshots/alertas_sanitarias.png" alt="Alertas sanitarias de lotes vencidos y stock crítico" /><br /><sub>Vencimientos y stock crítico</sub></td>
  </tr>
</table>
</details>

<details>
<summary><strong>02 · Ventas, caja y comprobantes</strong></summary>
<br />

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/ventas.png" alt="Listado de ventas y estado de cada operación" /><br /><sub>Registro y consulta de ventas</sub></td>
    <td width="50%"><img src="docs/screenshots/caja.png" alt="Estado de caja, saldos y movimientos del turno" /><br /><sub>Control de caja por turno</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/comprobante1.png" alt="Historial de comprobantes internos" /><br /><sub>Comprobantes internos</sub></td>
    <td width="50%"><img src="docs/screenshots/facturas1.png" alt="Listado de facturas en modo demostración" /><br /><sub>Facturación en modo demo</sub></td>
  </tr>
</table>
</details>

<details>
<summary><strong>03 · Reportes y administración</strong></summary>
<br />

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/reportes1.png" alt="Panel de reportes y estadísticas" /><br /><sub>Reportes y estadísticas</sub></td>
    <td width="50%"><img src="docs/screenshots/usuarios_roles.png" alt="Administración de usuarios, roles y estados" /><br /><sub>Usuarios y roles</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/proveedores1.png" alt="Listado de proveedores" /><br /><sub>Gestión de proveedores</sub></td>
    <td width="50%"><img src="docs/screenshots/login.png" alt="Pantalla de inicio de sesión de PharmaERP 360" /><br /><sub>Acceso al sistema</sub></td>
  </tr>
</table>
</details>

## Arquitectura

El proyecto sigue una arquitectura modular por dominio y separa responsabilidades entre presentación, aplicación, negocio y persistencia:

```text
App Router / componentes
          ↓
       actions
          ↓
       services
          ↓
      repository
          ↓
      Prisma ORM
          ↓
      PostgreSQL
```

Los módulos de negocio se encuentran en `src/modules/`. Las páginas y los componentes no acceden directamente a Prisma; las operaciones pasan por la capa correspondiente. Consulta el detalle en [Documentación de arquitectura](docs/ARCHITECTURE.md).

## Tecnologías

- **Interfaz y servidor:** Next.js 16, React 19 y TypeScript.
- **Estilos:** Tailwind CSS 4.
- **Persistencia:** PostgreSQL y Prisma ORM 7.
- **Calidad:** ESLint.

## Ejecutar en local

### Requisitos

- Node.js 18 o superior.
- PostgreSQL 14 o superior.
- Git.

### Instalación

```bash
git clone https://github.com/AlexJhailSanchezRea/farmacia-erp-app.git
cd farmacia-erp-app
npm install
```

Crea un archivo `.env` a partir de `.env.example` y configura la conexión a PostgreSQL y el secreto JWT:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/nexaerp_db?schema=public"
JWT_SECRET="reemplaza_por_un_secreto_largo_y_aleatorio"
NODE_ENV="development"
```

Prepara Prisma, aplica las migraciones y carga los datos de demostración:

```bash
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). También están disponibles `npm run lint` y `npm run build` para revisar el proyecto.

> Las cuentas creadas por el seed son solo para desarrollo local. Cambia las credenciales y secretos antes de cualquier despliegue; no subas el archivo `.env`.

## Estructura del código

```text
src/
├── app/          # Rutas y pantallas de Next.js
├── components/   # Componentes reutilizables
├── modules/      # Casos de uso organizados por dominio
├── lib/          # Infraestructura compartida
├── types/        # Tipos de la aplicación
└── validations/  # Validaciones de datos
prisma/
├── schema.prisma
└── seed.ts
```

## Estado y próximos pasos

El sistema se encuentra en desarrollo local con PostgreSQL y módulos funcionales para los flujos descritos. Algunas áreas —en especial la facturación— son demostrativas; consulta la nota de alcance antes de evaluar su uso fuera de desarrollo.

Posibles líneas de evolución:

- Pruebas automatizadas de los flujos críticos.
- Exportación ampliada de reportes.
- Integración fiscal conforme a la normativa del país de despliegue.
- Refuerzo de seguridad y preparación para producción.

## Autor

**Alex Jhail Sánchez Rea** · [GitHub](https://github.com/AlexJhailSanchezRea)

## Licencia

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE).