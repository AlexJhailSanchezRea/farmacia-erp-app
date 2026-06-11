-- CreateEnum
CREATE TYPE "EstadoCajaTurno" AS ENUM ('ABIERTA', 'CERRADA');

-- AlterTable
ALTER TABLE "movimientos_caja" ADD COLUMN     "cajaTurnoId" INTEGER;

-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "cajaTurnoId" INTEGER;

-- CreateTable
CREATE TABLE "cajas_turno" (
    "id" SERIAL NOT NULL,
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "montoInicial" DECIMAL(10,2) NOT NULL,
    "ingresosVentas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otrosIngresos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "egresos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldoEsperado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "montoContado" DECIMAL(10,2),
    "diferencia" DECIMAL(10,2),
    "observacionApertura" TEXT,
    "observacionCierre" TEXT,
    "estado" "EstadoCajaTurno" NOT NULL DEFAULT 'ABIERTA',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "usuarioAperturaId" INTEGER NOT NULL,
    "usuarioCierreId" INTEGER,

    CONSTRAINT "cajas_turno_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cajaTurnoId_fkey" FOREIGN KEY ("cajaTurnoId") REFERENCES "cajas_turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_cajaTurnoId_fkey" FOREIGN KEY ("cajaTurnoId") REFERENCES "cajas_turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas_turno" ADD CONSTRAINT "cajas_turno_usuarioAperturaId_fkey" FOREIGN KEY ("usuarioAperturaId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas_turno" ADD CONSTRAINT "cajas_turno_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
