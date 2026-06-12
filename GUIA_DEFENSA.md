# Guía de Defensa - NexaERP / PharmaERP 360

Este documento sirve como apoyo estructural y argumentativo para la defensa académica o presentación profesional del sistema NexaERP.

## 1. Presentación Breve del Sistema
NexaERP es un sistema modular de Planificación de Recursos Empresariales (ERP) enfocado en la pequeña y mediana empresa. Se ha especializado bajo el nombre de **PharmaERP 360** para cubrir las rigurosas exigencias del rubro farmacéutico, integrando control financiero (cajas), logístico (inventarios y lotes) y administrativo (seguridad y reportes).

## 2. Problema Identificado
Muchos pequeños comercios, especialmente farmacias independientes, gestionan sus procesos de manera desconectada: libretas para deudas, hojas de cálculo para inventarios, y un control de dinero basado netamente en la memoria visual. Esto genera descuadres de caja, pérdida de mercadería (vencimiento de lotes no detectados a tiempo) y vulnerabilidad a fraudes internos.

## 3. Objetivos
**Objetivo General:**
Desarrollar e implementar un sistema web centralizado, seguro e intuitivo que gestione de manera integral las operaciones de ventas, compras, caja y almacén (con énfasis farmacéutico) de una PyME.

**Objetivos Específicos:**
- Implementar un sistema de autenticación y control de accesos basado en roles (RBAC).
- Desarrollar un módulo de inventario que soporte la trazabilidad de lotes y fechas de vencimiento usando la lógica FEFO.
- Asegurar el flujo económico condicionando operaciones monetarias a la apertura y cierre de caja por turnos.
- Generar reportería exportable e historial inmutable (auditoría).

## 4. Justificación
Adoptar NexaERP no es solo una mejora tecnológica, sino una optimización del modelo de negocio. Se reducen los errores humanos gracias a la automatización del descargo de inventarios y el cuadre de caja; se protege la inversión evitando que expiren medicamentos; y se agiliza la atención al cliente con una interfaz responsiva y rápida construida bajo estándares modernos (Next.js y Server Actions).

## 5. Metodología
Se utilizó **Scrum-XP adaptada**:
- **Scrum**: Permitió dividir el gran bloque de trabajo en Sprints cortos e incrementos funcionales presentables, adaptándonos al cambio de requerimientos de forma ágil.
- **XP (Extreme Programming)**: Se aplicaron buenas prácticas como código simple, refactorización continua, y validaciones rigurosas (integración de linter estricto).

## 6. Arquitectura y Tecnologías
La arquitectura está basada en capas fuertemente tipadas en el Backend (Server Actions -> Services -> Repository) permitiendo que la UI (Componentes de React) quede limpia y aislada de la base de datos (PostgreSQL).
*Tecnologías*: Next.js App Router, React, Tailwind CSS, TypeScript, Prisma ORM, PostgreSQL.

## 7. Explicación de Conceptos Clave
- **Explicación de Roles (RBAC)**: En el sistema un Administrador controla todo, pero un Vendedor está confinado a operaciones diarias de mostrador, y un Farmacéutico/Inventario está confinado al cuidado del stock y vencimientos. Esto mitiga errores o sabotajes internos.
- **Explicación de FEFO**: First Expire, First Out (El primero en vencer, es el primero en salir). A diferencia de FIFO (First In, First Out), FEFO garantiza que el medicamento con la fecha de caducidad más cercana se despache primero, maximizando la vida útil del inventario restante.
- **Caja por Turno**: Cada usuario inicia con un monto, el sistema suma las ventas, resta los egresos, y calcula un saldo final esperado. Si hay discrepancia con lo contado en físico, el sistema detecta la diferencia, forzando transparencia y responsabilidad por turno.
- **Auditoría y Seguridad**: Cada vez que se anula una venta, se crea un usuario o cambia una contraseña, el sistema inserta un registro silencioso con el ID del responsable. Las contraseñas, además, se almacenan con hashes irreversibles, previniendo exposición de datos en caso de una filtración.
- **Facturación Demo**: Se genera un formato visual de factura con QR, listo para la integración fiscal (como el SIAT en Bolivia o el SIN en otros países), aunque en el estado actual funciona de modo demostrativo sin enviar firmas electrónicas al ente gubernamental.

## 8. Limitaciones y Próximos Pasos para Producción Real
- **Limitación Fiscal**: Ausencia de firma XML e integración SOAP/REST nativa de un servicio de impuestos nacionales.
- **Envío de Correos**: Para reset de contraseñas de manera automatizada (actualmente el reset es manual por el administrador).
- **Despliegue a Producción (Próximo paso)**: Adquisición de dominio, certificado SSL/HTTPS y servidor VPS para alojar el frontend en Node y el backend de PostgreSQL.

---

## 9. Posibles Preguntas del Tribunal
**P: ¿Por qué usaste Next.js en lugar de React puro (Vite) + Node/Express?**
**R**: Para simplificar la arquitectura, mejorar el rendimiento con el renderizado en el servidor (SSR), y aprovechar los Server Actions que nos permiten interactuar con la base de datos sin necesidad de construir y mantener manualmente docenas de endpoints API REST. Aporta mayor velocidad de desarrollo y mayor seguridad.

**P: Si un usuario intenta modificar la URL e ingresar al panel de Administrador, ¿qué sucede?**
**R**: Será rechazado. Implementamos una protección doble: El Client Component oculta la vista, pero aunque lo forzara, el Server Action valida en la sesión del servidor su rol en base de datos. Recibirá una vista de "No Autorizado".

**P: ¿Qué ocurre si anulo una venta que incluye un lote de producto del cual me quedaba poco stock?**
**R**: El sistema de NexaERP es transaccional. La anulación devuelve el estado de la venta a 'ANULADO', retorna las cantidades exactas de ese medicamento al LOTE original del que salieron, y crea un asiento de egreso negativo en el turno de caja abierto actual, manteniendo la coherencia tanto de stock como de finanzas.

---

## 10. Guion Oral (5-8 minutos)
1. **(1 min) Saludo y Contexto**: "Buenos días tribunal. Presento PharmaERP 360, un sistema ERP enfocado en modernizar farmacias. Actualmente el rubro sufre de inventarios caducados y robos hormiga por cajas descuadradas. Este sistema centraliza todo bajo un entorno seguro web."
2. **(1 min) Objetivos y Roles**: "Nuestro primer pilar es la seguridad. Entraré como Administrador para mostrar el RBAC (Control Basado en Roles). Pueden ver que un vendedor jamás podrá ver reportes financieros y un contador no podrá vender."
3. **(2 min) El Corazón Farmacéutico (FEFO)**: "Pasemos a Inventarios. Registraré una compra. Aquí el sistema me exige Lote y Fecha de Vencimiento obligatoriamente. Ahora, registraré una venta. Miren cómo el sistema no me pregunta qué lote estoy vendiendo; automáticamente descuenta del lote que está más próximo a vencer, aplicando la regla de negocio FEFO."
4. **(2 min) Trazabilidad Financiera**: "Nada de esto funciona si el dinero se pierde. Ninguna de estas ventas pudo realizarse si yo antes no hubiera 'Abierto Caja'. Al final del día, cierro mi turno. El sistema me pregunta cuánto dinero tengo físico, lo ingreso, y él me indica si cuadra con lo esperado o si hay un faltante."
5. **(1 min) Escalabilidad y Cierre**: "Para el administrador, todo se resume en métricas. Aquí están los reportes exportables y nuestra pista de auditoría inmutable. PharmaERP 360 fue desarrollado con Next.js y PostgreSQL, listo para integrarse a facturación electrónica fiscal y escalar hacia la nube. Muchas gracias."
