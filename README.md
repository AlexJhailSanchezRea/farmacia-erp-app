# PharmaERP 360

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

<p align="center">
  <strong>ERP modular para farmacias y negocios con control de inventario, ventas, caja, clientes, proveedores, reportes y auditoría.</strong>
</p>

## Descripción general

PharmaERP 360 es un sistema ERP modular orientado a farmacias y negocios con gestión comercial y operativa. La solución está diseñada para controlar productos, categorías, clientes, proveedores, compras, ventas, inventario, caja, comprobantes y reportes desde una misma plataforma.

La arquitectura del proyecto está pensada para seguir una estructura modular por dominio, con una capa de presentación, aplicación, negocio y acceso a datos bajo App Router de Next.js y Prisma con PostgreSQL.

## Objetivo

Centralizar la gestión operativa de una farmacia o negocio comercial para:

- controlar stock en tiempo real
- manejar lotes y vencimientos
- optimizar ventas y compras
- controlar caja por turno
- mejorar trazabilidad y auditoría
- reducir errores manuales

## Funcionalidades principales

- Autenticación y control de usuarios por roles
- Gestión de productos, categorías y proveedores
- Inventario con lógica FEFO y control de vencimientos
- Gestión de clientes y comprobantes
- Compras y ventas con flujo de negocio integrado
- Apertura y cierre de caja
- Alertas por stock bajo y vencimientos próximos
- Reportes y auditoría
- Arquitectura modular por módulos de negocio

## Stack tecnológico

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- ESLint

## Capturas del sistema

### Login

![Login](docs/screenshots/login.svg)

### Dashboard

![Dashboard](docs/screenshots/dashboard.svg)

### Inventario

![Inventario](docs/screenshots/inventory.svg)

### Ventas

![Ventas](docs/screenshots/sales.svg)

## Usuarios demo

Después de ejecutar el seed, puedes probar con estos usuarios:

- Administrador: `admin@nexaerp.com` / `Admin12345`
- Vendedor: `vendedor@nexaerp.com` / `Vendedor12345`
- Inventario/Farmacia: `inventario@nexaerp.com` / `Inventario12345`
- Contador: `contador@nexaerp.com` / `Contador12345`

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Git

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/AlexJhailSanchezRea/farmacia-erp-app.git
cd farmacia-erp-app
```

2. Instala dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
```

4. Ajusta la conexión local de PostgreSQL en `.env`:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/nexaerp_db?schema=public"
```

5. Genera el cliente de Prisma y aplica migraciones:

```bash
npx prisma generate
npx prisma migrate deploy
```

6. Ejecuta el seed:

```bash
npx tsx prisma/seed.ts
```

7. Inicia la aplicación:

```bash
npm run dev
```

La app estará disponible en:

```text
http://localhost:3000
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con este ejemplo:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/nexaerp_db?schema=public"
JWT_SECRET="cambia_esta_clave_por_una_generada_segura"
NODE_ENV="development"
```

## Comandos útiles

```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## Arquitectura del sistema

El proyecto sigue la arquitectura en capas propuesta por el equipo:

```text
page.tsx
-> actions.ts
-> services.ts
-> repository.ts
-> Prisma
-> PostgreSQL
```

Esto mantiene una separación clara entre:

- capa de presentación
- lógica de aplicación
- lógica de negocio
- acceso a datos
- base de datos

## Estructura principal

```text
src/
  app/
  components/
  modules/
  lib/
  types/
  validations/
prisma/
  schema.prisma
  seed.ts
public/
```

## Módulos principales

- auth
- usuarios
- roles
- productos
- categorias
- clientes
- proveedores
- compras
- ventas
- inventario
- caja
- reportes
- comprobantes
- farmacia

## Estado del proyecto

- Sistema funcional en desarrollo local
- Base de datos PostgreSQL integrada
- Login operativo con usuarios demo
- Dashboard principal funcionando
- Módulos base implementados y listos para extensión

## Roadmap

- Mejorar UX en módulos de ventas y compras
- Añadir exportación de reportes PDF/Excel
- Integración con facturación electrónica
- Mejoras de seguridad y validación avanzada
- Optimización de rendimiento y pruebas

## Contribución

Las contribuciones son bienvenidas. Para colaborar:

1. Haz un fork del repositorio
2. Crea una rama de feature
3. Realiza tus cambios
4. Abre un pull request con una descripción clara

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

- GitHub: https://github.com/AlexJhailSanchezRea
- Proyecto: https://github.com/AlexJhailSanchezRea/farmacia-erp-app

## Nota importante

La funcionalidad actual de facturación demo es conceptual y no reemplaza una facturación fiscal real. Para entornos de producción se requiere integración con un proveedor o normativa fiscal correspondiente.

