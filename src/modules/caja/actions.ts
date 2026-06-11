"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { 
    servicioRegistrarMovimientoManual, 
    servicioAbrirCaja, 
    servicioCerrarCaja 
} from "./services";
import { movimientoCajaSchema } from "./validations";
import { accionRegistrarAuditoria } from "@/modules/auditoria/actions";

export async function registrarMovimientoAccion(prevState: unknown, formData: FormData) {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario || !verificarPermisoAccion(usuario.rol.nombre, "crear_movimiento_caja")) {
        return { error: "No tienes permisos para realizar esta acción." };
    }
    try {
        const tipoMovimiento = formData.get("tipoMovimiento")?.toString() as "INGRESO" | "EGRESO" | "AJUSTE";
        const concepto = formData.get("concepto")?.toString() || "";
        const monto = formData.get("monto") ? Number(formData.get("monto")) : 0;
        const referencia = formData.get("referencia")?.toString() || "";

        const validacion = movimientoCajaSchema.safeParse({
            tipoMovimiento,
            concepto,
            monto,
            referencia
        });

        if (!validacion.success) {
            return { error: validacion.error.issues[0].message };
        }

        const mov = await servicioRegistrarMovimientoManual(validacion.data);
        revalidatePath("/caja");
        revalidatePath("/reportes"); // Revalidar dashboard y reportes
        revalidatePath("/");

        await accionRegistrarAuditoria({
            modulo: "Caja",
            accion: "Movimiento Manual",
            descripcion: `${validacion.data.tipoMovimiento}: ${validacion.data.concepto} (Bs ${validacion.data.monto})`,
            entidadId: mov.id,
            entidad: "MovimientoCaja"
        });

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al registrar el movimiento." };
    }
}

export async function abrirCajaAccion(prevState: unknown, formData: FormData) {
    const usuario = await obtenerUsuarioAutenticado();
    // Validar rol de administrador o contador
    if (!usuario || (usuario.rol.nombre !== "Administrador" && usuario.rol.nombre !== "Contador")) {
        return { error: "No tienes permisos para abrir caja." };
    }
    try {
        const montoInicial = formData.get("montoInicial") ? Number(formData.get("montoInicial")) : 0;
        const observacion = formData.get("observacionApertura")?.toString() || "";

        const caja = await servicioAbrirCaja(usuario.id, montoInicial, observacion);
        
        revalidatePath("/caja");
        
        await accionRegistrarAuditoria({
            modulo: "Caja",
            accion: "Apertura de Caja",
            descripcion: `Caja abierta con monto inicial de Bs ${montoInicial}.`,
            entidadId: caja.id,
            entidad: "CajaTurno"
        });

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al abrir la caja." };
    }
}

export async function cerrarCajaAccion(prevState: unknown, formData: FormData) {
    const usuario = await obtenerUsuarioAutenticado();
    // Validar rol de administrador o contador
    if (!usuario || (usuario.rol.nombre !== "Administrador" && usuario.rol.nombre !== "Contador")) {
        return { error: "No tienes permisos para cerrar caja." };
    }
    try {
        const cajaId = Number(formData.get("cajaId"));
        const montoContado = formData.get("montoContado") ? Number(formData.get("montoContado")) : 0;
        const observacion = formData.get("observacionCierre")?.toString() || "";

        const caja = await servicioCerrarCaja(cajaId, usuario.id, montoContado, observacion);
        
        revalidatePath("/caja");
        
        await accionRegistrarAuditoria({
            modulo: "Caja",
            accion: "Cierre de Caja",
            descripcion: `Caja cerrada. Contado: Bs ${caja.montoContado}. Diferencia: Bs ${caja.diferencia}.`,
            entidadId: caja.id,
            entidad: "CajaTurno"
        });

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al cerrar la caja." };
    }
}
