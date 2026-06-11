-- CreateTable
CREATE TABLE "facturas_demo" (
    "id" SERIAL NOT NULL,
    "numeroFactura" TEXT NOT NULL,
    "cuf" TEXT NOT NULL,
    "cufd" TEXT NOT NULL,
    "leyenda" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "ventaId" INTEGER NOT NULL,

    CONSTRAINT "facturas_demo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facturas_demo_numeroFactura_key" ON "facturas_demo"("numeroFactura");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_demo_ventaId_key" ON "facturas_demo"("ventaId");

-- AddForeignKey
ALTER TABLE "facturas_demo" ADD CONSTRAINT "facturas_demo_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
