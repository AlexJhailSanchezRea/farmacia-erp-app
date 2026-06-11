"use server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { verificarPermisoAccion } from "@/lib/permissions";

import { revalidatePath } from "next/cache";
import { servicioRegistrarMovimientoManual } from "./services";
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
