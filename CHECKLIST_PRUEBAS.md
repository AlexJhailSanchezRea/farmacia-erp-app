# Checklist Final de Pruebas - NexaERP / PharmaERP 360

Este documento contiene la lista completa y ordenada de pruebas funcionales y no funcionales para validar todo el sistema antes de la documentación final y preparación para deploy.

## Usuarios Demo para Pruebas

- **Administrador**: `admin@nexaerp.com` / `Admin12345`
- **Vendedor**: `vendedor@nexaerp.com` / `Vendedor12345`
- **Inventario/Farmacia**: `inventario@nexaerp.com` / `Inventario12345`
- **Contador**: `contador@nexaerp.com` / `Contador12345`

---

## 1. Autenticación
- [ ] **Login correcto**: Ingresar credenciales válidas y verificar redirección correcta según rol.
- [ ] **Login incorrecto**: Ingresar contraseña errónea o correo inexistente y verificar mensaje de error genérico.
- [ ] **Logout**: Cerrar sesión y verificar redirección a la página de login.
- [ ] **Sesión fantasma**: Intentar acceder al dashboard con una cookie de sesión expirada o inválida.
- [ ] **Acceso a rutas protegidas**: Navegar manualmente a rutas protegidas sin estar autenticado y verificar redirección al login.

## 2. Roles y Permisos
- [ ] **Administrador**: Verificar acceso total a todos los módulos y opciones de configuración.
- [ ] **Vendedor**: Verificar acceso a caja, ventas, clientes y comprobantes. Restringido en reportes financieros y configuración.
- [ ] **Inventario/Farmacia**: Verificar acceso a productos, categorías, proveedores y alertas. Sin acceso a caja, ventas o configuraciones críticas.
- [ ] **Contador**: Verificar acceso a reportes e historial. Sin acceso a caja operativa o modificaciones críticas.
- [ ] **Acceso permitido por rol**: Comprobar que los botones y menús correspondientes al rol están visibles.
- [ ] **Acceso denegado por rol**: Ocultar u deshabilitar botones que no corresponden al rol.
- [ ] **Prueba escribiendo rutas manualmente**: Intentar acceder a `/configuracion` con un usuario de rol Vendedor y verificar bloqueo (pantalla "No Autorizado").

## 3. Usuarios
- [ ] **Crear usuario**: Validar que el administrador puede crear un nuevo usuario.
- [ ] **Editar usuario**: Validar la actualización de datos y roles de usuarios existentes.
- [ ] **Resetear contraseña por administrador**: Probar el reset de contraseña y la invalidación de sesiones antiguas.
- [ ] **Cambiar contraseña propia**: Ingresar como usuario estándar y cambiar la contraseña correctamente.
- [ ] **Verificar que no se exponga contrasenaHash**: Revisar la carga de la página (DevTools > Network) para comprobar que no viajan hashes de contraseña al frontend.

## 4. Productos
- [ ] **Crear producto**: Registrar un producto con sus datos base y confirmar persistencia.
- [ ] **Editar producto**: Actualizar nombre, precio, o stock mínimo.
- [ ] **Buscar producto**: Buscar por nombre o código en la tabla.
- [ ] **Paginar productos**: Navegar entre páginas cuando hay múltiples registros.
- [ ] **Validar stock bajo**: Comprobar que el producto aparece en alertas si el stock es menor al mínimo.
- [ ] **Validar datos farmacéuticos**: Comprobar que permite agregar principio activo, receta médica, etc.

## 5. Categorías
- [ ] **Crear categoría**: Añadir nueva categoría con nombre y descripción.
- [ ] **Listar categorías**: Verificar su despliegue en la vista principal y selectores.
- [ ] **Ver productos asociados si existe**: Comprobar que se refleja la asociación si se implementó este contador/vista.

## 6. Clientes
- [ ] **Crear cliente**: Registrar cliente con nombre y NIT/CI.
- [ ] **Buscar cliente**: Búsqueda por nombre o NIT/CI.
- [ ] **Paginar clientes**: Navegación entre las páginas del listado.

## 7. Proveedores
- [ ] **Crear proveedor**: Registrar proveedor con nombre, NIT, contacto.
- [ ] **Buscar proveedor**: Búsqueda por nombre comercial o NIT.
- [ ] **Paginar proveedores**: Navegación entre páginas.

## 8. Compras
- [ ] **Registrar compra**: Agregar detalle, seleccionar proveedor, y guardar compra.
- [ ] **Validar aumento de stock**: Comprobar que los productos comprados incrementan su stock.
- [ ] **Validar lote**: Confirmar que el lote ingresado se guarda correctamente asociado al producto.
- [ ] **Validar fecha de vencimiento**: Confirmar persistencia de la fecha en formato correcto.
- [ ] **Validar egreso de caja si aplica**: Ver si el flujo actual deduce dinero de la caja activa.
- [ ] **Bloqueo si no hay caja abierta**: Si aplica, verificar que el sistema no permite la compra si no hay caja activa y requiere dinero de la misma.

## 9. Ventas
- [ ] **Registrar venta**: Agregar productos, cliente, cantidad y total; emitir venta.
- [ ] **Validar descuento de stock**: Confirmar que la cantidad se restó del inventario general.
- [ ] **Validar FEFO**: Verificar que el sistema descuenta primero del lote con fecha de vencimiento más próxima.
- [ ] **Validar comprobante automático**: Generación e impresión opcional del comprobante.
- [ ] **Validar caja abierta**: Permitir la operación sólo si el turno del usuario está activo.
- [ ] **Validar bloqueo sin caja abierta**: Prohibir ventas si no hay sesión de caja abierta.
- [ ] **Buscar ventas**: Buscar por número de venta o cliente.
- [ ] **Paginar ventas**: Navegación entre páginas.

## 10. Anulación de Ventas
- [ ] **Anular venta activa**: Marcar venta como anulada (EstadoRegistro).
- [ ] **Motivo obligatorio**: Exigir razón de la anulación para auditoría.
- [ ] **No permitir anular dos veces**: Validar bloqueo sobre ventas ya anuladas.
- [ ] **Devolver stock general**: Confirmar reintegro de inventario de cada producto.
- [ ] **Devolver stock por lote**: Confirmar que el producto retornó al lote de origen correcto.
- [ ] **Crear egreso de caja por anulación**: Comprobar asiento negativo o deducción por reembolso.
- [ ] **Marcar comprobante como anulado**: Reflejar visualmente en pantalla e impresión.
- [ ] **Marcar factura demo como anulada**: Validar estado de la factura virtual vinculada.
- [ ] **Registrar auditoría**: Verificar el log de la anulación con el motivo.

## 11. Inventario
- [ ] **Ver movimientos**: Revisar historial de entradas y salidas.
- [ ] **Validar entradas por compras**: Coincidencia de montos de productos comprados.
- [ ] **Validar salidas por ventas**: Coincidencia de salidas de productos vendidos.
- [ ] **Validar entradas por anulación**: Confirmación del re-ingreso en inventario.
- [ ] **Buscar y paginar si aplica**: Probar la paginación del kardex o historial.

## 12. Lotes y Vencimientos
- [ ] **Ver lotes vencidos**: Validar aparición en alerta sanitaria si caducó.
- [ ] **Ver lotes próximos a vencer**: Validar alertas si está en rango configurado de proximidad.
- [ ] **Ver stock crítico**: Productos por debajo del stock mínimo.
- [ ] **Validar alertas sanitarias**: Verificar color/insignia (Naranja/Rojo) en el dashboard o módulo correspondiente.

## 13. Caja por Turno
- [ ] **Abrir caja**: Registrar monto de apertura inicial.
- [ ] **Bloquear doble apertura**: No permitir abrir si ya hay una abierta por el usuario.
- [ ] **Registrar movimiento manual**: Egreso o ingreso con justificación.
- [ ] **Registrar venta con caja abierta**: Asociar ID de caja/turno a la venta.
- [ ] **Cerrar caja**: Validar totales esperados.
- [ ] **Calcular saldo esperado**: Sumatoria de Ventas + Apertura + Ingresos - Egresos.
- [ ] **Calcular diferencia**: Resta entre monto contado por usuario vs monto esperado del sistema.
- [ ] **Ver historial**: Listar cajas cerradas anteriores.
- [ ] **Imprimir cierre de caja**: Generar resumen impreso.
- [ ] **Paginar historial**: Navegar listado de turnos antiguos.

## 14. Comprobantes
- [ ] **Listar comprobantes**: Ver comprobantes de venta emitidos.
- [ ] **Ver comprobante**: Detalle en modal o vista individual.
- [ ] **Imprimir comprobante**: Comprobación con `window.print()` (Client Component).
- [ ] **Ver marca ANULADO si corresponde**: Sello visible en comprobantes de ventas anuladas.
- [ ] **Buscar y paginar comprobantes**: Buscar por cliente o nro comprobante y navegación de páginas.

## 15. Facturación Demo
- [ ] **Generar factura demo manualmente**: Emisión simulada.
- [ ] **Evitar duplicados por venta**: Bloquear emisión de una segunda factura sobre la misma venta.
- [ ] **Ver factura demo**: Visualizar estructura (QR falso, NIT falso).
- [ ] **Imprimir factura demo**: Impresión local sin romper formato.
- [ ] **Ver aviso "no válida fiscalmente"**: Letrero claro indicativo de su estado demo.
- [ ] **Ver ANULADA si la venta fue anulada**: Reflejar anulación indirecta si se anuló la venta original.
- [ ] **Buscar y paginar facturas**: Navegación en el módulo.

## 16. Reportes
- [ ] **Ver KPIs**: Datos estadísticos en dashboard o módulo de reportes.
- [ ] **Imprimir reporte**: Reportes tabulares usando función de impresión local.
- [ ] **Exportar CSV de ventas**: Descarga correcta (Server Action).
- [ ] **Exportar CSV de compras**: Descarga correcta.
- [ ] **Exportar CSV de caja**: Descarga de turnos/movimientos.
- [ ] **Exportar CSV de stock bajo**: Listado de reposición sugerida.
- [ ] **Exportar CSV de lotes próximos a vencer**: Para retiro oportuno de estanterías.
- [ ] **Validar que no exporte datos sensibles**: Chequeo en los CSV para asegurar ausencia de hashes de password.
- [ ] **Validar permisos de exportación**: Confirmar que Vendedores o Farmacéuticos sin rol no puedan exportar data masiva crítica.

## 17. Configuración
- [ ] **Acceder como administrador**: Ingreso válido.
- [ ] **Editar datos institucionales**: Razón social, NIT, teléfono, logo (si aplica).
- [ ] **Ver datos reflejados en comprobantes/facturas**: Efecto inmediato de la configuración en recibos generados a continuación.
- [ ] **Bloquear acceso a otros roles**: Intentar modificar por un Vendedor -> Acceso denegado.

## 18. Auditoría
- [ ] **Ver registros como administrador**: Lectura de logs de acciones.
- [ ] **Buscar auditoría**: Por módulo, acción, o usuario involucrado.
- [ ] **Paginar auditoría**: Manejo óptimo de la tabla principal que almacena miles de eventos.
- [ ] **Validar registro de login, logout, venta, compra, anulación, caja, configuración y contraseña**.
- [ ] **Bloquear acceso a otros roles**: Acceso exclusivo para el perfil de Administración u homólogos.

## 19. Mantenimiento y Backup
- [ ] **Acceder solo como administrador**: Bloqueo absoluto para roles inferiores.
- [ ] **Ver instrucciones de backup**: Confirmar presencia del manual visual o script.
- [ ] **Verificar que no se exponga DATABASE_URL**: Ni en inspección ni en logs exportados.
- [ ] **Verificar que backups/ esté ignorado por Git**: Revisar `git status` o `.gitignore`.
- [ ] **Verificar existencia de script de backup si fue creado**: Comprobar ubicación de script local o en package.json.

## 20. Responsive y Accesibilidad
- [ ] **Probar en escritorio**: Diseño nativo full-HD o similares.
- [ ] **Probar en tablet**: Adaptabilidad intermedia.
- [ ] **Probar en móvil**: Hamburguesa operativa, tablas con scroll horizontal.
- [ ] **Probar contraste claro/oscuro**: Cambio dinámico en la UI (Dark Mode) y visibilidad de los datos en ambos temas.
- [ ] **Probar tablas con scroll**: Desplazamiento nativo sin romper el layout superior.
- [ ] **Probar foco de teclado básico**: Navegación de formularios accesible y usable con "Tab".

## 21. Build y Calidad
- [ ] **npx prisma validate**: Esquema correcto, sin warnings no resueltos.
- [ ] **npm run lint**: Cero errores críticos de tipado/ESLint.
- [ ] **npm run build**: `Compiled successfully` y `Generating static pages` correcto, sin caídas por Typescript.
- [ ] **git status limpio**: Confirmación de que todo ha sido stageado y commiteado para la entrega final.
