-- AlterTable
ALTER TABLE "movimientos_inventario" ADD COLUMN     "loteId" INTEGER;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "concentracion" TEXT,
ADD COLUMN     "laboratorio" TEXT,
ADD COLUMN     "presentacion" TEXT,
ADD COLUMN     "principioActivo" TEXT,
ADD COLUMN     "requiereReceta" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "lotes_producto" (
    "id" SERIAL NOT NULL,
    "numeroLote" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockInicial" INTEGER NOT NULL DEFAULT 0,
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "lotes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lotes_producto_productoId_numeroLote_key" ON "lotes_producto"("productoId", "numeroLote");

-- AddForeignKey
ALTER TABLE "lotes_producto" ADD CONSTRAINT "lotes_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "lotes_producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
