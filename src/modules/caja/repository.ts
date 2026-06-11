import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MovimientoCajaCliente, ResumenCaja } from "./types";

export async function obtenerMovimientosCaja(): Promise<MovimientoCajaCliente[]> {
    const movimientos = await prisma.movimientoCaja.findMany({
        orderBy: { fechaMovimiento: "desc" },
        where: { estado: "ACTIVO" }
    });

    return movimientos.map(m => ({
        id: m.id,
        tipoMovimiento: m.tipoMovimiento,
        concepto: m.concepto,
        monto: Number(m.monto),
        fechaMovimiento: m.fechaMovimiento.toISOString(),
        referencia: m.referencia,
        estado: m.estado,
        ventaId: m.ventaId,
        compraId: m.compraId,
        creadoEn: m.creadoEn.toISOString()
    }));
}

export async function registrarMovimientoManual(data: { tipoMovimiento: "INGRESO" | "EGRESO" | "AJUSTE", concepto: string, monto: number, referencia?: string }) {
    // Si el tipo es EGRESO o AJUSTE negativo, internamente lo podríamos guardar negativo, 
    // pero la regla general es guardar el monto en absoluto y tratarlo según el tipoMovimiento.
    // Vamos a guardar todo como absoluto.
    const montoAbsoluto = Math.abs(data.monto);

    // Salvo que sea un AJUSTE negativo
    const montoFinal = (data.tipoMovimiento === "AJUSTE" && data.monto < 0) ? data.monto : montoAbsoluto;

    return await prisma.movimientoCaja.create({
        data: {
            tipoMovimiento: data.tipoMovimiento,
            concepto: data.concepto,
            monto: new Prisma.Decimal(montoFinal),
            referencia: data.referencia || null
        }
    });
}

export async function calcularResumenCaja(): Promise<ResumenCaja> {
    const ingresos = await prisma.movimientoCaja.aggregate({
        _sum: { monto: true },
        where: { tipoMovimiento: "INGRESO", estado: "ACTIVO" }
    });

    const egresos = await prisma.movimientoCaja.aggregate({
        _sum: { monto: true },
        where: { tipoMovimiento: "EGRESO", estado: "ACTIVO" }
    });

    const ajustesPositivos = await prisma.movimientoCaja.aggregate({
        _sum: { monto: true },
        where: { tipoMovimiento: "AJUSTE", estado: "ACTIVO", monto: { gte: 0 } }
    });

    const ajustesNegativos = await prisma.movimientoCaja.aggregate({
        _sum: { monto: true },
        where: { tipoMovimiento: "AJUSTE", estado: "ACTIVO", monto: { lt: 0 } }
    });

    const totalIngresos = Number(ingresos._sum.monto || 0) + Number(ajustesPositivos._sum.monto || 0);
    const totalEgresos = Number(egresos._sum.monto || 0) + Math.abs(Number(ajustesNegativos._sum.monto || 0));

    return {
        totalIngresos,
        totalEgresos,
        saldoActual: totalIngresos - totalEgresos
    };
}
