import { z } from "zod";

export const movimientoCajaSchema = z.object({
    tipoMovimiento: z.enum(["INGRESO", "EGRESO", "AJUSTE"]),
    concepto: z.string().min(3, "El concepto es obligatorio y debe tener al menos 3 caracteres."),
    monto: z.coerce.number().min(0.01, "El monto debe ser mayor a 0."),
    referencia: z.string().optional()
});

export type MovimientoCajaFormValues = z.infer<typeof movimientoCajaSchema>;
