# NexaERP / PharmaERP 360

## Descripción General
NexaERP es un sistema ERP modular diseñado para pequeños y medianos negocios. En su especialización **PharmaERP 360**, ofrece una gestión completa orientada a farmacias, abarcando desde el control de inventario y lotes hasta la facturación y el manejo de caja por turno. El sistema está construido con un enfoque en seguridad, escalabilidad y facilidad de uso.

## Objetivo del Sistema
Proveer a las empresas una herramienta unificada para gestionar sus operaciones comerciales, financieras y logísticas, asegurando la integridad de los datos, reduciendo el margen de error humano y optimizando los tiempos de atención al cliente y toma de decisiones.

## Problema que Resuelve
Muchos pequeños y medianos negocios operan con sistemas desactualizados, hojas de cálculo o procesos manuales que derivan en pérdida de inventario, descuadre de cajas y falta de información en tiempo real. NexaERP resuelve esto centralizando ventas, compras, caja y reportes bajo un sistema moderno de roles y permisos, evitando manipulaciones indebidas y automatizando el flujo de entrada y salida (FEFO para farmacias).

## Tecnologías Usadas
- **Frontend**: React, Next.js (App Router), Tailwind CSS
- **Backend**: Next.js Server Actions, TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Calidad de Código**: ESLint

## Requisitos Previos
- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- Git

## Instalación Local
1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd nexa-erp-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Variables de Entorno Necesarias
Crea un archivo `.env` en la raíz del proyecto basándote en un posible `.env.example`. Las variables clave incluyen (no exponer valores reales):
- `DATABASE_URL`: Cadena de conexión a PostgreSQL.
- `JWT_SECRET` (o similar): Clave para manejo de sesiones/tokens si aplica.

## Comandos Principales
Para operar en desarrollo, utiliza los siguientes comandos:
- `npm install`: Instala las dependencias.
- `npx prisma generate`: Genera el cliente de Prisma.
- `npx prisma migrate dev`: Ejecuta las migraciones en la base de datos.
- `npx tsx prisma/seed.ts`: Pobla la base de datos con datos iniciales (roles, configuración, admin).
- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
- `npm run lint`: Ejecuta el linter para revisar la calidad del código.
- `npm run build`: Construye la versión optimizada de producción.

## Usuarios Demo
Para ingresar al sistema con datos de prueba pre-cargados (si se ha ejecutado el seed):
- **Administrador**: `admin@nexaerp.com` / `Admin12345`
- **Vendedor**: `vendedor@nexaerp.com` / `Vendedor12345`
- **Inventario/Farmacia**: `inventario@nexaerp.com` / `Inventario12345`
- **Contador**: `contador@nexaerp.com` / `Contador12345`

## Módulos Principales
- **Autenticación y Perfil**: Login seguro y cambio de contraseñas.
- **Configuración y Usuarios**: Gestión institucional y roles/permisos (RBAC).
- **Inventario y Productos**: Control de stock, categorías, lotes, vencimientos y lógica FEFO.
- **Entidades**: Gestión de Clientes y Proveedores.
- **Compras y Ventas**: Entradas y salidas de almacén, con emisión de comprobantes y validación de cajas.
- **Caja por Turno**: Control de aperturas, cierres, saldo esperado vs contado e historial de movimientos de dinero.
- **Reportes y Auditoría**: Exportación de KPIs y log exhaustivo de acciones realizadas en el sistema.

> [!WARNING]
> **Aviso Importante sobre Facturación:** La funcionalidad actual de "Facturación Demo" no genera facturas fiscales reales ni válidas para el SIAT (Bolivia) o el SIN. Es puramente demostrativa y funcional a nivel interno. Se requiere integración adicional con un proveedor fiscal para ser válida en producción comercial.
