// Definición de módulos que coinciden con los nombres en el menú del Dashboard
export type ModuloNombre = 
  | "Productos" 
  | "Categorías" 
  | "Clientes" 
  | "Proveedores" 
  | "Compras" 
  | "Ventas" 
  | "Inventario" 
  | "Caja" 
  | "Reportes" 
  | "Comprobantes" 
  | "Alertas Sanitarias" 
  | "Usuarios y Roles"
  | "Configuracion"
  | "Auditoria"
  | "Facturación Demo"
  | "Mantenimiento";

// Acciones específicas de escritura
export type AccionNombre = 
  | "crear_producto"
  | "editar_producto"
  | "crear_categoria"
  | "crear_cliente"
  | "editar_cliente"
  | "crear_proveedor"
  | "editar_proveedor"
  | "crear_compra"
  | "crear_venta"
  | "crear_usuario"
  | "editar_usuario"
  | "crear_movimiento_caja"
  | "anular_venta";

// Configuración centralizada de Roles y Accesos
const PERMISOS_MODULOS: Record<string, ModuloNombre[]> = {
  "Administrador": [
    "Productos", "Categorías", "Clientes", "Proveedores", "Compras", "Ventas", 
    "Inventario", "Caja", "Reportes", "Comprobantes", "Facturación Demo", "Alertas Sanitarias", "Usuarios y Roles", "Configuracion", "Auditoria", "Mantenimiento"
  ],
  "Vendedor": [
    "Ventas", "Productos", "Clientes", "Comprobantes", "Facturación Demo"
  ],
  "Inventario/Farmacia": [
    "Productos", "Categorías", "Proveedores", "Compras", "Inventario", "Alertas Sanitarias"
  ],
  "Contador": [
    "Caja", "Reportes", "Compras", "Ventas", "Comprobantes", "Facturación Demo"
  ]
};

const PERMISOS_ACCIONES: Record<string, AccionNombre[]> = {
  "Administrador": [
    "crear_producto", "editar_producto", "crear_categoria", "crear_cliente", 
    "editar_cliente", "crear_proveedor", "editar_proveedor", "crear_compra", 
    "crear_venta", "crear_usuario", "editar_usuario", "crear_movimiento_caja", "anular_venta"
  ],
  "Vendedor": [
    "crear_venta", "crear_cliente", "editar_cliente"
  ],
  "Inventario/Farmacia": [
    "crear_producto", "editar_producto", "crear_categoria", "crear_proveedor", "editar_proveedor", "crear_compra"
  ],
  "Contador": [
    "anular_venta"
  ]
};

/**
 * Verifica si el rol tiene acceso a leer un módulo específico
 */
export function verificarAccesoModulo(rolNombre: string, modulo: ModuloNombre): boolean {
  const modulosPermitidos = PERMISOS_MODULOS[rolNombre];
  if (!modulosPermitidos) return false;
  return modulosPermitidos.includes(modulo);
}

/**
 * Verifica si el rol tiene permisos para realizar una acción de escritura
 */
export function verificarPermisoAccion(rolNombre: string, accion: AccionNombre): boolean {
  const accionesPermitidas = PERMISOS_ACCIONES[rolNombre];
  if (!accionesPermitidas) return false;
  return accionesPermitidas.includes(accion);
}
