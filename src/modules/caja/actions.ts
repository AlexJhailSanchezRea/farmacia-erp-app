"use server";

import { revalidatePath } from "next/cache";
import { servicioRegistrarMovimientoManual } from "./services";
import { movimientoCajaSchema } from "./validations";

export async function registrarMovimientoAccion(prevState: unknown, formData: FormData) {
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
            return { error: validacion.error.errors[0].message };
        }

        await servicioRegistrarMovimientoManual(validacion.data);
        revalidatePath("/caja");
        revalidatePath("/reportes"); // Revalidar dashboard y reportes
        revalidatePath("/");

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Error al registrar el movimiento." };
    }
}
