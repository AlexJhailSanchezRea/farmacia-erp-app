# Reglas de desarrollo para NexaERP

## 1. Descripcion del proyecto

NexaERP es un sistema ERP modular para pequenos y medianos negocios. El sistema debe permitir administrar productos, categorias, clientes, proveedores, compras, ventas, inventario, caja, comprobantes y reportes.

La base del sistema debe ser reutilizable para diferentes rubros comerciales, por ejemplo farmacia, ferreteria, taller, minimarket, tienda de ropa o repuestos.

La primera especializacion sera para farmacia, agregando control de lotes, vencimientos, laboratorios, principio activo, alertas de vencimiento y logica FEFO.

## 2. Stack tecnologico

El proyecto utiliza:

* Next.js con App Router
* TypeScript
* React
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* ESLint
* Git y GitHub

No usar:

* Express
* Bootstrap
* Vite
* XAMPP
* MySQL
* Backend separado
* Codigo JavaScript sin TypeScript

## 3. Arquitectura oficial

El sistema debe desarrollarse bajo una arquitectura en capas con organizacion modular por modulos de negocio.

Capas principales:

1. Capa de presentacion
2. Capa de aplicacion
3. Capa de negocio
4. Capa de acceso a datos
5. Base de datos

Flujo correcto:

page.tsx
-> actions.ts
-> services.ts
-> repository.ts
-> Prisma
-> PostgreSQL

Regla importante:

Las paginas y componentes no deben conectarse directamente a Prisma. La logica de negocio debe estar en services.ts y el acceso a datos en repository.ts.

## 4. Organizacion modular

El codigo debe organizarse por modulos de negocio dentro de src/modules.

Modulos base sugeridos:

* auth
* usuarios
* roles
* productos
* categorias
* clientes
* proveedores
* compras
* ventas
* inventario
* caja
* reportes
* comprobantes

Modulos especializados sugeridos:

* farmacia
* ferreteria
* taller
* minimarket
* tienda

## 5. Estructura de carpetas esperada

La estructura principal debe ser:

src/
app/
components/
modules/
lib/
types/
validations/

Cada modulo debe mantener una estructura similar:

src/modules/productos/
actions.ts
services.ts
repository.ts
validations.ts
types.ts

## 6. Idioma del codigo

El codigo propio del sistema debe estar en espanol.

Usar nombres como:

* Producto
* Categoria
* Cliente
* Proveedor
* Venta
* Compra
* Inventario
* Caja
* Comprobante
* Usuario
* Rol

Usar nombres de rutas en espanol:

* /productos
* /ventas
* /compras
* /clientes
* /proveedores
* /inventario
* /caja
* /reportes

Evitar tildes, espacios y la letra ñ en nombres tecnicos.

Correcto:

* Categoria
* contrasena
* gestion
* anio

Incorrecto:

* Categoría
* contraseña
* gestión
* año

Los textos visibles para el usuario si pueden usar tildes y redaccion correcta en espanol.

## 7. Seguridad

Aplicar buenas practicas de seguridad:

* No guardar contrasenas en texto plano.
* Usar hash seguro para contrasenas.
* No exponer variables de entorno.
* No subir archivos .env al repositorio.
* Validar datos antes de guardar.
* Sanitizar entradas del usuario cuando corresponda.
* Proteger rutas privadas.
* Controlar permisos por rol.
* No mostrar errores internos al usuario final.
* No ejecutar codigo peligroso o comandos destructivos sin aprobacion.

## 8. Base de datos

La base de datos sera PostgreSQL.

El acceso a la base de datos debe hacerse mediante Prisma ORM.

No escribir consultas SQL directas salvo que sea estrictamente necesario y este justificado.

Los modelos de Prisma deben tener nombres claros y en espanol cuando sean propios del dominio.

## 9. Buenas practicas de desarrollo

Aplicar:

* Codigo limpio
* Separacion de responsabilidades
* Principio de responsabilidad unica
* Nombres descriptivos
* Funciones pequenas
* Validaciones con Zod cuando corresponda
* Manejo adecuado de errores
* Reutilizacion de componentes
* Commits frecuentes y descriptivos
* No modificar archivos innecesarios
* No duplicar logica de negocio

## 10. Metodologia

El proyecto se desarrolla con Scrum-XP adaptado.

Scrum se usa para organizar el avance mediante sprints e incrementos funcionales.

XP se usa para mejorar la calidad del codigo mediante:

* Historias de usuario
* Codigo simple
* Refactorizacion
* Pruebas basicas
* Integracion frecuente con Git
* Revision continua del codigo
* Programacion asistida con IA

## 11. Reglas para agentes de IA

Antes de modificar archivos, el agente debe indicar:

1. Que va a hacer
2. Por que lo hara
3. Que archivos va a crear o modificar
4. Que comandos va a ejecutar
5. Que riesgos existen
6. Como se verificara que funciona

El agente no debe realizar cambios grandes sin aprobacion.

El agente debe mantener la arquitectura en capas y la organizacion modular.

El agente debe explicar el codigo de forma clara para que el desarrollador pueda defenderlo en una exposicion o defensa tecnica.

## 12. Objetivo academico y profesional

El proyecto debe servir para:

* Practicar desarrollo full stack moderno
* Preparar una defensa tecnica universitaria
* Crear un proyecto fuerte para portafolio
* Reutilizar la base del sistema para diferentes rubros comerciales
* Demostrar conocimientos de arquitectura, metodologia, seguridad y buenas practicas
