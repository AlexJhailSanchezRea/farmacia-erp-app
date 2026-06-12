# Manual de Usuario - NexaERP / PharmaERP 360

Bienvenido al manual operativo de NexaERP. Aquí encontrarás instrucciones paso a paso para dominar cada uno de los módulos de la plataforma.

## Acceso al Sistema
### Iniciar Sesión
1. Dirígete a la página de ingreso `/login`.
2. Ingresa tu correo electrónico y tu contraseña en los campos correspondientes.
3. Haz clic en "Ingresar". Si las credenciales son correctas, serás redirigido al panel principal.

### Cerrar Sesión
1. En el panel principal, busca tu nombre o ícono de perfil en la parte superior derecha.
2. Haz clic en la opción "Cerrar Sesión".

### Cambiar Contraseña
1. Dirígete a la pestaña de "Perfil" o "Seguridad" en el menú.
2. Ingresa tu contraseña actual.
3. Ingresa y confirma tu nueva contraseña.
4. Presiona "Guardar". Si tienes otras sesiones abiertas en diferentes dispositivos, se cerrarán automáticamente por seguridad.

## Módulos Principales
### Panel Principal (Dashboard)
Aquí verás un resumen rápido del estado de tu negocio, accesos directos a los módulos que tu rol permite y posibles alertas de stock bajo o lotes por vencer.

### Administrar Usuarios
*Exclusivo para el Rol Administrador.*
1. Ve al menú **Usuarios**.
2. Para agregar: Presiona "+ Nuevo Usuario", rellena sus datos y asígnale un rol.
3. Para editar: Haz clic en "Editar" en la fila correspondiente y actualiza su información.
4. Para resetear contraseña: Haz clic en la opción de reset; la cuenta volverá a una contraseña por defecto que el usuario deberá cambiar más tarde.

### Administrar Productos
1. Accede al menú **Productos**.
2. **Crear**: Haz clic en "+ Nuevo Producto", completa el código, nombre, categoría, precio y stock mínimo. Si es un producto farmacéutico, puedes llenar los campos específicos de farmacia.
3. **Buscar**: Usa la barra superior para filtrar rápidamente por nombre o código.

### Administrar Clientes y Proveedores
Los módulos **Clientes** y **Proveedores** funcionan de forma idéntica.
1. Ingresa al módulo deseado.
2. Utiliza "+ Nuevo" para registrar un nuevo perfil (añadiendo su NIT/CI, nombre, teléfono).
3. Usa la tabla paginada y la barra de búsqueda para ubicar contactos rápidamente.

## Inventario y Operaciones Financieras
### Abrir y Cerrar Caja (Caja por Turno)
*Obligatorio antes de realizar compras, ventas o movimientos de dinero.*
1. En el menú, dirígete a **Caja**.
2. Si está cerrada, introduce el monto inicial o saldo de apertura y haz clic en **Abrir Caja**.
3. Para cerrar, haz clic en **Cerrar Caja** al finalizar tu turno. Se te pedirá el monto exacto de billetes y monedas contados.
4. El sistema calculará el **Saldo Esperado** e indicará cualquier diferencia (faltante o sobrante).
5. Puedes revisar turnos pasados en **Historial de Caja**.

### Registrar Compras
1. Ve a **Compras** y haz clic en "+ Registrar Compra".
2. Selecciona un proveedor e ingresa el número de comprobante (opcional).
3. Agrega productos al detalle, indicando cantidad y costo unitario.
4. **Importante**: Para cada ítem, ingresa su Número de Lote y Fecha de Vencimiento obligatoriamente.
5. Haz clic en "Registrar Compra". Esto incrementará el inventario en el sistema.

### Registrar Ventas
1. Ve a **Ventas** y haz clic en "+ Nueva Venta".
2. Selecciona al cliente.
3. Añade productos. El sistema indicará si hay stock suficiente.
4. Finaliza la venta. El sistema descontará automáticamente el stock (usando la lógica de "el primero en vencer es el primero en salir").

### Anular Ventas
1. Dentro del módulo **Ventas**, ubica la venta a anular y haz clic en "Anular".
2. Ingresa un motivo válido.
3. Se descontará el ingreso de la caja actual, el comprobante quedará inválido y los productos regresarán a su lote de inventario de origen.

## Comprobantes y Reportes
### Ver Comprobantes
En el módulo **Comprobantes**, puedes buscar cualquier recibo generado por ventas previas y presionar "Ver/Imprimir" para obtener una copia térmica o en papel.

### Facturas Demo
Las **Facturas Demo** se comportan como los comprobantes pero emulan un diseño fiscal (QR, NIT emisor, códigos). **Nota Legal**: Estas facturas indican que son de demostración y carecen de validez fiscal ante impuestos.

### Ver y Exportar Reportes
1. Ve a **Reportes**.
2. Selecciona el tipo de informe (Ventas, Compras, Caja, Stock Bajo, Vencimientos).
3. Haz clic en "Exportar CSV" para descargar una hoja de cálculo a tu dispositivo.

## Auditoría y Configuración
### Ver Auditoría
*Exclusivo para Administrador.*
El módulo **Auditoría** muestra un registro paginado de todas las acciones importantes (inicios de sesión, anulaciones, configuraciones). Útil para rastrear errores humanos o manipulación.

### Usar Mantenimiento y Backup
*Exclusivo para Administrador.*
Instrucciones detalladas y guías de respaldo de base de datos se encuentran en el panel **Mantenimiento**. Siempre guarda tus respaldos en lugares seguros.

---

## Entendiendo los Roles (RBAC)
- **Administrador**: Control total del sistema, permisos, configuraciones, usuarios y auditorías.
- **Vendedor**: Opera la caja, registra clientes, ejecuta ventas y emite comprobantes. No ve reportes contables ni inventario profundo.
- **Inventario/Farmacia**: Registra proveedores, crea productos, registra compras (ingreso de lotes) y monitorea el stock y fechas de vencimiento. No opera la caja.
- **Contador**: Accede a históricos de caja, reportes financieros exportables y listados, pero no puede generar transacciones nuevas ni alterar configuraciones de la tienda.
