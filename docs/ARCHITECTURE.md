# Arquitectura de PharmaERP 360

## Visión general

El sistema sigue una arquitectura modular y orientada a capas para separar responsabilidades y facilitar mantenimiento, prueba y evolución.

## Capas

### 1. Capa de presentación
Ubicada en `src/app` y en componentes reutilizables.

Responsabilidad:
- renderizar interfaces
- capturar entrada del usuario
- invocar acciones del sistema

### 2. Capa de aplicación
Ubicada en `src/modules/*` con archivos `actions.ts` y `services.ts`.

Responsabilidad:
- coordinar casos de uso
- ejecutar validaciones y lógica de negocio
- orquestar llamadas a repositorios

### 3. Capa de negocio
Incluye servicios y validaciones del dominio.

Responsabilidad:
- reglas del negocio
- validaciones
- transformaciones de datos

### 4. Capa de acceso a datos
Ubicada en `repository.ts` por módulo.

Responsabilidad:
- consultar y persistir datos en PostgreSQL mediante Prisma
- encapsular consultas y transacciones

### 5. Base de datos
PostgreSQL con Prisma ORM.

Responsabilidad:
- almacenamiento persistente
- integridad de datos
- trazabilidad y auditoría

## Flujo recomendado

```text
page.tsx
-> actions.ts
-> services.ts
-> repository.ts
-> Prisma
-> PostgreSQL
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

## Principios aplicados

- separación de responsabilidades
- reutilización de componentes
- validación temprana de datos
- seguridad por roles
- trazabilidad y auditoría
- desarrollo modular y escalable
