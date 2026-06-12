# Documentación Técnica - NexaERP / PharmaERP 360

Este documento detalla la estructura, decisiones arquitectónicas y funcionamiento interno del sistema NexaERP.

## 1. Arquitectura en Capas
El sistema está construido bajo un patrón de arquitectura por capas para garantizar la separación de responsabilidades y la mantenibilidad a largo plazo. El flujo estricto de comunicación es:

`page.tsx` -> `actions.ts` -> `services.ts` -> `repository.ts` -> `prisma.ts` -> `PostgreSQL`

- **page.tsx / components.tsx (Capa de Presentación)**: Componentes React ejecutados en Servidor o Cliente que renderizan la UI. No contienen lógica de negocio ni acceso a datos directo.
- **actions.ts (Capa de Aplicación - Server Actions)**: Puntos de entrada desde el cliente hacia el servidor. Gestionan la autorización (RBAC), validaciones iniciales e invocan los servicios.
- **services.ts (Capa de Negocio)**: Contienen el núcleo de las reglas de negocio del ERP (cálculo de stock, validaciones FEFO, lógicas de anulación). Orquestan el flujo apoyándose en repositorios.
- **repository.ts (Capa de Acceso a Datos)**: Responsable exclusivo de interactuar con Prisma para consultas y mutaciones.
- **prisma.ts / PostgreSQL**: Capa de persistencia.

## 2. Organización Modular
El código fuente reside en `src/modules` y `src/app`. Cada módulo agrupa su lógica específica:
- `auth`, `usuarios`, `roles`, `productos`, `categorias`, `clientes`, `proveedores`, `compras`, `ventas`, `inventario`, `caja`, `reportes`, `comprobantes`, `facturas`, `auditoria`.
Cada módulo en `src/modules/<nombre_modulo>` incluye idealmente sus propios `actions.ts`, `services.ts`, `repository.ts` y `types.ts`.

## 3. Stack Técnico
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **UI**: React, Tailwind CSS
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma

## 4. Modelo de Base de Datos por Módulos
- **Usuarios y Roles**: Tablas `Usuario`, `Rol`, `Permiso`, `PermisoRol`.
- **Entidades Básicas**: Tablas `Producto`, `Categoria`, `Cliente`, `Proveedor`.
- **Transacciones**: Tablas `Compra`, `DetalleCompra` (registran lotes y vencimientos), `Venta`, `DetalleVenta`.
- **Caja y Control**: Tablas `CajaTurno` (manejo de apertura, cierre, montos), `MovimientoCaja`.
- **Facturación y Auditoría**: Tablas `Comprobante`, `FacturaDemo`, `Auditoria`.
- **Configuración**: Tabla `Configuracion` (datos institucionales).

## 5. Autenticación y Seguridad
- **Manejo de Sesiones**: Sistema de login basado en encriptación de contraseña (bcrypt o similar compatible) validado contra la base de datos.
- **Contraseñas**: Almacenadas en formato de hash irreducible (`contrasenaHash`). Nunca se exponen al cliente.
- **RBAC (Roles y Permisos)**: Autorización en el backend (`actions.ts`) y frontend (`verificarAccesoModulo`). Se evalúa si un usuario posee el permiso adecuado antes de ejecutar una acción crítica.

## 6. Lógica de Negocio Central
### Caja por Turno
El sistema impone una regla estricta: *Ninguna operación de dinero (venta, egreso, ingreso) se puede realizar sin una caja abierta*. 
Cada sesión de caja registra: usuario, fecha/hora, monto de apertura, y estado (ABIERTA/CERRADA). Al cerrar, se calcula el Saldo Esperado y la Diferencia contra el monto contado.

### Compras, Ventas e Inventario
- **Compras**: Alimentan el inventario. En farmacia, crean instancias específicas con su número de Lote y Fecha de Vencimiento.
- **Ventas**: Descuentan del stock aplicando la regla FEFO. Se debe enlazar obligatoriamente con un turno de caja activo.
- **Inventario (FEFO)**: *First Expire, First Out*. El sistema busca satisfacer la cantidad de una venta descontando primero de los lotes más próximos a vencer, dividiendo automáticamente si un lote no alcanza el total requerido.

### Anulación de Ventas
La anulación no elimina registros. Cambia el estado a "ANULADO". Revierte el stock (devolviendo las cantidades a los lotes exactos de origen) y genera un egreso de caja con el motivo especificado. Invalida comprobantes y facturas.

## 7. Reportes, Auditoría y Paginación
- **Auditoría**: Cada acción destructiva, de seguridad o transaccional genera un log indicando Quién, Qué y Cuándo.
- **Reportes**: Extracción de datos en CSV (seguros y sin exposición de claves) e impresión nativa desde el cliente.
- **Paginación y Búsqueda**: Implementada en servidor (Server-side) usando `skip` y `take` de Prisma, empujados por `searchParams` dinámicos. Esto asegura que la UI no colapse frente a tablas con miles de registros.

## 8. Backup y Mantenimiento
Se ha reservado un entorno y una metodología local orientada a proteger la base de datos. El ERP está preparado para exportar y restaurar dumps de PostgreSQL.

## 9. Decisiones y Limitaciones Técnicas
- **Server Actions vs API Routes**: Se prefirieron Server Actions para integrar estrechamente el backend y la UI en Next.js, reduciendo código de fetching.
- **Facturación Demo**: Se ha desarrollado una lógica de facturación estructurada para parecer fiscal, pero actualmente omite la firma electrónica (XML) obligatoria del SIAT. Esta es una limitación intencional hasta la integración con un proveedor autorizado.
- **Soft Delete**: El estado `EstadoRegistro` (`ACTIVO` / `INACTIVO` / `ANULADO`) se utiliza en lugar de eliminar tuplas de base de datos (`DELETE` físico), garantizando trazabilidad y relaciones consistentes.
