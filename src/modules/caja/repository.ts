import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MovimientoCajaCliente, ResumenCaja, CajaTurnoCliente } from "./types";

export async function repositoryObtenerCajaAbierta(): Promise<CajaTurnoCliente | null> {
    const caja = await prisma.cajaTurno.findFirst({
        where: { estado: "ABIERTA" },
        include: {
            usuarioApertura: true,
            usuarioCierre: true
        }
    });

    if (!caja) return null;

    return {
        id: caja.id,
        fechaApertura: caja.fechaApertura.toISOString(),
        fechaCierre: caja.fechaCierre ? caja.fechaCierre.toISOString() : null,
        montoInicial: Number(caja.montoInicial),
        ingresosVentas: Number(caja.ingresosVentas),
        otrosIngresos: Number(caja.otrosIngresos),
        egresos: Number(caja.egresos),
        saldoEsperado: Number(caja.saldoEsperado),
        montoContado: caja.montoContado ? Number(caja.montoContado) : null,
        diferencia: caja.diferencia ? Number(caja.diferencia) : null,
        observacionApertura: caja.observacionApertura,
        observacionCierre: caja.observacionCierre,
        estado: caja.estado,
        usuarioAperturaNombre: caja.usuarioApertura.nombre,
        usuarioCierreNombre: caja.usuarioCierre?.nombre || null
    };
}

export async function repositoryObtenerHistorialCajas(): Promise<CajaTurnoCliente[]> {
    const cajas = await prisma.cajaTurno.findMany({
        orderBy: { fechaApertura: "desc" },
        include: {
            usuarioApertura: true,
            usuarioCierre: true
        }
    });

    return cajas.map(caja => ({
        id: caja.id,
        fechaApertura: caja.fechaApertura.toISOString(),
        fechaCierre: caja.fechaCierre ? caja.fechaCierre.toISOString() : null,
        montoInicial: Number(caja.montoInicial),
        ingresosVentas: Number(caja.ingresosVentas),
        otrosIngresos: Number(caja.otrosIngresos),
        egresos: Number(caja.egresos),
        saldoEsperado: Number(caja.saldoEsperado),
        montoContado: caja.montoContado ? Number(caja.montoContado) : null,
        diferencia: caja.diferencia ? Number(caja.diferencia) : null,
        observacionApertura: caja.observacionApertura,
        observacionCierre: caja.observacionCierre,
        estado: caja.estado,
        usuarioAperturaNombre: caja.usuarioApertura.nombre,
        usuarioCierreNombre: caja.usuarioCierre?.nombre || null
    }));
}

export async function repositoryAbrirCaja(data: { usuarioId: number, montoInicial: number, observacion?: string }) {
    const abierta = await prisma.cajaTurno.findFirst({ where: { estado: "ABIERTA" } });
    if (abierta) throw new Error("Ya existe una caja abierta en este momento.");

    return await prisma.$transaction(async (tx) => {
        const caja = await tx.cajaTurno.create({
            data: {
                usuarioAperturaId: data.usuarioId,
                montoInicial: data.montoInicial,
                observacionApertura: data.observacion || null,
                estado: "ABIERTA"
            }
        });

        if (data.montoInicial > 0) {
            await tx.movimientoCaja.create({
                data: {
                    tipoMovimiento: "INGRESO",
                    concepto: "Monto inicial de apertura",
                    monto: data.montoInicial,
                    referencia: "APERTURA",
                    cajaTurnoId: caja.id
                }
            });
        }

        return caja;
    });
}

export async function repositoryCerrarCaja(data: { cajaId: number, usuarioId: number, montoContado: number, observacion?: string }) {
    return await prisma.$transaction(async (tx) => {
        const caja = await tx.cajaTurno.findUnique({ where: { id: data.cajaId } });
        if (!caja) throw new Error("Caja no encontrada");
        if (caja.estado === "CERRADA") throw new Error("La caja ya está cerrada");

        // Calcular ingresos y egresos de los movimientos asociados a esta caja
        const movimientos = await tx.movimientoCaja.findMany({
            where: { cajaTurnoId: data.cajaId, estado: "ACTIVO" }
        });

        let ingresosVentas = 0;
        let otrosIngresos = 0;
        let egresos = 0;

        for (const m of movimientos) {
            const monto = Number(m.monto);
            if (m.tipoMovimiento === "INGRESO") {
                if (m.ventaId) {
                    ingresosVentas += monto;
                } else if (m.referencia !== "APERTURA") { // Evitamos duplicar el monto inicial
                    otrosIngresos += monto;
                }
            } else if (m.tipoMovimiento === "EGRESO") {
                egresos += monto;
            } else if (m.tipoMovimiento === "AJUSTE") {
                if (monto > 0) otrosIngresos += monto;
                else egresos += Math.abs(monto);
            }
        }

        const saldoEsperado = Number(caja.montoInicial) + ingresosVentas + otrosIngresos - egresos;
        const diferencia = data.montoContado - saldoEsperado;

        const cajaCerrada = await tx.cajaTurno.update({
            where: { id: data.cajaId },
            data: {
                estado: "CERRADA",
                fechaCierre: new Date(),
                usuarioCierreId: data.usuarioId,
                ingresosVentas,
                otrosIngresos,
                egresos,
                saldoEsperado,
                montoContado: data.montoContado,
                diferencia,
                observacionCierre: data.observacion || null
            }
        });

        return cajaCerrada;
    });
}

export async function obtenerMovimientosCaja(): Promise<MovimientoCajaCliente[]> {
    const cajaAbierta = await prisma.cajaTurno.findFirst({ where: { estado: "ABIERTA" } });
    
    const movimientos = await prisma.movimientoCaja.findMany({
        orderBy: { fechaMovimiento: "desc" },
        where: cajaAbierta ? { cajaTurnoId: cajaAbierta.id, estado: "ACTIVO" } : { estado: "ACTIVO" }
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
        cajaTurnoId: m.cajaTurnoId,
        creadoEn: m.creadoEn.toISOString()
    }));
}

export async function registrarMovimientoManual(data: { tipoMovimiento: "INGRESO" | "EGRESO" | "AJUSTE", concepto: string, monto: number, referencia?: string }) {
    const cajaAbierta = await prisma.cajaTurno.findFirst({ where: { estado: "ABIERTA" } });
    if (!cajaAbierta) {
        throw new Error("Debe abrir caja antes de registrar operaciones de dinero");
    }

    const montoAbsoluto = Math.abs(data.monto);
    const montoFinal = (data.tipoMovimiento === "AJUSTE" && data.monto < 0) ? data.monto : montoAbsoluto;

    return await prisma.movimientoCaja.create({
        data: {
            tipoMovimiento: data.tipoMovimiento,
            concepto: data.concepto,
            monto: new Prisma.Decimal(montoFinal),
            referencia: data.referencia || null,
            cajaTurnoId: cajaAbierta.id
        }
    });
}

export async function calcularResumenCaja(): Promise<ResumenCaja> {
    const cajaAbierta = await repositoryObtenerCajaAbierta();
    if (!cajaAbierta) {
        return { totalIngresos: 0, totalEgresos: 0, saldoActual: 0 };
    }

    const movimientos = await prisma.movimientoCaja.findMany({
        where: { cajaTurnoId: cajaAbierta.id, estado: "ACTIVO" }
    });

    let totalIngresos = 0;
    let totalEgresos = 0;

    for (const m of movimientos) {
        if (m.referencia === "APERTURA") continue; // Excluir apertura para no afectar total ingresos
        const monto = Number(m.monto);
        if (m.tipoMovimiento === "INGRESO") totalIngresos += monto;
        else if (m.tipoMovimiento === "EGRESO") totalEgresos += monto;
        else if (m.tipoMovimiento === "AJUSTE") {
            if (monto > 0) totalIngresos += monto;
            else totalEgresos += Math.abs(monto);
        }
    }

    return {
        totalIngresos,
        totalEgresos,
        saldoActual: cajaAbierta.montoInicial + totalIngresos - totalEgresos
    };
}
