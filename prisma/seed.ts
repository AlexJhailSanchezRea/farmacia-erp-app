import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL no esta configurada en el archivo .env");
}

const adapter = new PrismaPg({
    connectionString: databaseUrl,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // 1. Roles
    const roles = [
        { nombre: "Administrador", descripcion: "Usuario con acceso total al sistema." },
        { nombre: "Vendedor", descripcion: "Usuario encargado de registrar ventas y consultar productos." },
        { nombre: "Encargado de inventario", descripcion: "Usuario encargado de compras, stock e inventario." },
    ];

    for (const rol of roles) {
        await prisma.rol.upsert({
            where: { nombre: rol.nombre },
            update: { descripcion: rol.descripcion },
            create: { nombre: rol.nombre, descripcion: rol.descripcion },
        });
    }

    // 2. Categorías (10 mínimas)
    const categoriasBase = [
        { nombre: "Medicamentos", descripcion: "Medicamentos en general" },
        { nombre: "Analgesicos", descripcion: "Medicamentos para el alivio del dolor" },
        { nombre: "Antiinflamatorios", descripcion: "Medicamentos contra la inflamación" },
        { nombre: "Antibioticos", descripcion: "Medicamentos para tratar infecciones" },
        { nombre: "Vitaminas", descripcion: "Suplementos vitamínicos y minerales" },
        { nombre: "Cuidado personal", descripcion: "Productos de cuidado personal" },
        { nombre: "Higiene", descripcion: "Productos de higiene" },
        { nombre: "Primeros auxilios", descripcion: "Insumos para primeros auxilios" },
        { nombre: "Bebes", descripcion: "Productos para bebés y maternidad" },
        { nombre: "Equipos medicos", descripcion: "Equipamiento e instrumental médico" },
    ];

    for (const cat of categoriasBase) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: { descripcion: cat.descripcion },
            create: { nombre: cat.nombre, descripcion: cat.descripcion },
        });
    }

    const categoriasDB = await prisma.categoria.findMany();
    const mapCat = new Map(categoriasDB.map(c => [c.nombre, c.id]));

    // 3. Productos (30)
    const productosBase = [
        { nombre: "Paracetamol 500 mg", descripcion: "Caja x 100", codigoBarra: "770001", precioCompra: 15.00, precioVenta: 20.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Analgesicos") },
        { nombre: "Ibuprofeno 400 mg", descripcion: "Caja x 50", codigoBarra: "770002", precioCompra: 12.00, precioVenta: 18.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Antiinflamatorios") },
        { nombre: "Diclofenaco 50 mg", descripcion: "Caja x 50", codigoBarra: "770003", precioCompra: 18.00, precioVenta: 25.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Antiinflamatorios") },
        { nombre: "Amoxicilina 500 mg", descripcion: "Caja x 100", codigoBarra: "770004", precioCompra: 30.00, precioVenta: 45.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Antibioticos") },
        { nombre: "Vitamina C 1000 mg", descripcion: "Frasco x 30", codigoBarra: "770005", precioCompra: 20.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Complejo B", descripcion: "Caja x 30", codigoBarra: "770006", precioCompra: 25.00, precioVenta: 38.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Alcohol medicinal 70", descripcion: "Frasco 1000 ml", codigoBarra: "770007", precioCompra: 10.00, precioVenta: 15.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Agua oxigenada", descripcion: "Frasco 120 ml", codigoBarra: "770008", precioCompra: 5.00, precioVenta: 8.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Algodon hidrofilo", descripcion: "Paquete 100g", codigoBarra: "770009", precioCompra: 6.00, precioVenta: 10.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Gasas esteriles", descripcion: "Sobre x 5 unid", codigoBarra: "770010", precioCompra: 3.00, precioVenta: 5.00, stockActual: 0, stockMinimo: 50, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Termometro digital", descripcion: "Unidad", codigoBarra: "770011", precioCompra: 20.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Equipos medicos") },
        { nombre: "Tensiometro digital", descripcion: "Unidad de brazo", codigoBarra: "770012", precioCompra: 150.00, precioVenta: 220.00, stockActual: 0, stockMinimo: 2, categoriaId: mapCat.get("Equipos medicos") },
        { nombre: "Mascarillas descartables", descripcion: "Caja x 50 unid", codigoBarra: "770013", precioCompra: 15.00, precioVenta: 25.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Guantes de latex", descripcion: "Caja x 100 unid", codigoBarra: "770014", precioCompra: 35.00, precioVenta: 50.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Shampoo medicado", descripcion: "Frasco 200 ml", codigoBarra: "770015", precioCompra: 40.00, precioVenta: 60.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Cuidado personal") },
        { nombre: "Jabon antibacterial", descripcion: "Barra 90g", codigoBarra: "770016", precioCompra: 4.00, precioVenta: 7.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Higiene") },
        { nombre: "Panales talla M", descripcion: "Paquete x 40", codigoBarra: "770017", precioCompra: 50.00, precioVenta: 70.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Bebes") },
        { nombre: "Toallitas humedas", descripcion: "Paquete x 80", codigoBarra: "770018", precioCompra: 12.00, precioVenta: 18.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Bebes") },
        { nombre: "Suero oral", descripcion: "Sobre x 1", codigoBarra: "770019", precioCompra: 2.50, precioVenta: 5.00, stockActual: 0, stockMinimo: 50, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Curitas adhesivas", descripcion: "Caja x 100", codigoBarra: "770020", precioCompra: 8.00, precioVenta: 15.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Aspirina 100 mg", descripcion: "Caja x 100 tabletas", codigoBarra: "770021", precioCompra: 10.00, precioVenta: 16.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Analgesicos") },
        { nombre: "Losartan 50 mg", descripcion: "Caja x 30", codigoBarra: "770022", precioCompra: 22.00, precioVenta: 30.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Loratadina 10 mg", descripcion: "Caja x 20", codigoBarra: "770023", precioCompra: 14.00, precioVenta: 22.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Omeprazol 20 mg", descripcion: "Caja x 30", codigoBarra: "770024", precioCompra: 18.00, precioVenta: 28.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Crema hidratante", descripcion: "Tubo 150 ml", codigoBarra: "770025", precioCompra: 30.00, precioVenta: 45.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Cuidado personal") },
        { nombre: "Vitamina D3", descripcion: "Frasco x 60", codigoBarra: "770026", precioCompra: 40.00, precioVenta: 65.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Jeringa 5ml", descripcion: "Unidad", codigoBarra: "770027", precioCompra: 0.50, precioVenta: 1.00, stockActual: 0, stockMinimo: 100, categoriaId: mapCat.get("Equipos medicos") },
        { nombre: "Aziromicina 500 mg", descripcion: "Caja x 3", codigoBarra: "770028", precioCompra: 25.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Antibioticos") },
        { nombre: "Cefalexina 500 mg", descripcion: "Caja x 100", codigoBarra: "770029", precioCompra: 80.00, precioVenta: 120.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Antibioticos") },
        { nombre: "Biberon antigases", descripcion: "Unidad 250ml", codigoBarra: "770030", precioCompra: 45.00, precioVenta: 70.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Bebes") }
    ];

    for (const prod of productosBase) {
        if (!prod.categoriaId) continue;
        
        await prisma.producto.upsert({
            where: { codigoBarra: prod.codigoBarra },
            update: { 
                nombre: prod.nombre,
                descripcion: prod.descripcion,
                precioCompra: prod.precioCompra,
                precioVenta: prod.precioVenta,
                stockMinimo: prod.stockMinimo,
                categoriaId: prod.categoriaId
            },
            create: { ...prod, categoriaId: prod.categoriaId },
        });
    }

    // 4. Clientes (15)
    const clientesBase = [
        { nombre: "Cliente General", ciNit: "0" },
        { nombre: "Juan Perez" },
        { nombre: "Maria Lopez" },
        { nombre: "Carlos Ramirez" },
        { nombre: "Ana Torres" },
        { nombre: "Luis Fernandez" },
        { nombre: "Patricia Rojas" },
        { nombre: "Miguel Vargas" },
        { nombre: "Daniela Castro" },
        { nombre: "Roberto Medina" },
        { nombre: "Sofia Gutierrez" },
        { nombre: "Jorge Salazar" },
        { nombre: "Farmacia Central", ciNit: "1234567" },
        { nombre: "Clinica Los Andes", ciNit: "9876543" },
        { nombre: "Hospital Obrero", ciNit: "3333333" },
    ];

    for (const cli of clientesBase) {
        const existe = await prisma.cliente.findFirst({ where: { nombre: cli.nombre } });
        if (existe) {
            await prisma.cliente.update({
                where: { id: existe.id },
                data: { ciNit: cli.ciNit || existe.ciNit }
            });
        } else {
            await prisma.cliente.create({ data: cli });
        }
    }

    // 5. Proveedores (10)
    const proveedoresBase = [
        { nombre: "Distribuidora Salud" },
        { nombre: "FarmaProveedor Bolivia" },
        { nombre: "Insumos Medicos del Sur" },
        { nombre: "Laboratorios Andinos" },
        { nombre: "Comercial Biofarma" },
        { nombre: "Drogueria Central" },
        { nombre: "Importadora Medica Nacional" },
        { nombre: "Proveedora San Gabriel" },
        { nombre: "Laboratorios Bago", nit: "987654321" },
        { nombre: "Drogueria Inti", nit: "112233445" }
    ];

    for (const prov of proveedoresBase) {
        const existe = await prisma.proveedor.findFirst({ where: { nombre: prov.nombre } });
        if (existe) {
            await prisma.proveedor.update({
                where: { id: existe.id },
                data: { nit: prov.nit || existe.nit }
            });
        } else {
            await prisma.proveedor.create({ data: prov });
        }
    }

    const proveedoresDB = await prisma.proveedor.findMany();
    const productosDB = await prisma.producto.findMany();

    // 6. Compras y Movimientos (5 compras con transacciones e idempotencia)
    if (proveedoresDB.length > 0 && productosDB.length >= 10) {
        const comprasDePrueba = [
            { numeroCompra: "SEED-COMP-001", proveedor: proveedoresDB[0], detalles: [ { prod: productosDB[0], cant: 100 }, { prod: productosDB[1], cant: 50 } ] },
            { numeroCompra: "SEED-COMP-002", proveedor: proveedoresDB[1], detalles: [ { prod: productosDB[2], cant: 40 }, { prod: productosDB[3], cant: 80 } ] },
            { numeroCompra: "SEED-COMP-003", proveedor: proveedoresDB[2], detalles: [ { prod: productosDB[4], cant: 60 }, { prod: productosDB[5], cant: 45 }, { prod: productosDB[6], cant: 120 } ] },
            { numeroCompra: "SEED-COMP-004", proveedor: proveedoresDB[3], detalles: [ { prod: productosDB[7], cant: 80 }, { prod: productosDB[8], cant: 90 } ] },
            { numeroCompra: "SEED-COMP-005", proveedor: proveedoresDB[4], detalles: [ { prod: productosDB[9], cant: 200 }, { prod: productosDB[10], cant: 30 } ] },
        ];

        for (const compraBase of comprasDePrueba) {
            // Verificar idempotencia
            const existeCompra = await prisma.compra.findFirst({ where: { numeroCompra: compraBase.numeroCompra } });
            
            if (!existeCompra) {
                // Ejecutar transacción para crear compra, detalles e inventario
                await prisma.$transaction(async (tx) => {
                    let totalCompra = 0;
                    
                    const nuevaCompra = await tx.compra.create({
                        data: {
                            numeroCompra: compraBase.numeroCompra,
                            proveedorId: compraBase.proveedor.id,
                            observacion: "Compra inicial de prueba",
                            total: 0 // Se actualizará al final
                        }
                    });

                    for (const det of compraBase.detalles) {
                        const subtotal = det.cant * Number(det.prod.precioCompra);
                        totalCompra += subtotal;

                        // 1. Crear detalle
                        await tx.detalleCompra.create({
                            data: {
                                compraId: nuevaCompra.id,
                                productoId: det.prod.id,
                                cantidad: det.cant,
                                precioUnitario: det.prod.precioCompra,
                                subtotal: subtotal
                            }
                        });

                        // Obtener stock actual real dentro de la transaccion
                        const prodActual = await tx.producto.findUniqueOrThrow({ where: { id: det.prod.id } });
                        const stockAnterior = prodActual.stockActual;
                        const stockNuevo = stockAnterior + det.cant;

                        // 2. Aumentar stock
                        await tx.producto.update({
                            where: { id: det.prod.id },
                            data: { stockActual: stockNuevo }
                        });

                        // 3. Crear movimiento (ENTRADA)
                        await tx.movimientoInventario.create({
                            data: {
                                tipoMovimiento: "ENTRADA",
                                cantidad: det.cant,
                                stockAnterior: stockAnterior,
                                stockNuevo: stockNuevo,
                                motivo: `Compra ${compraBase.numeroCompra}`,
                                compraId: nuevaCompra.id,
                                productoId: det.prod.id
                            }
                        });
                    }

                    // Actualizar el total de la compra
                    await tx.compra.update({
                        where: { id: nuevaCompra.id },
                        data: { total: totalCompra }
                    });
                });
            }
        }
    }

    console.log("Seed completado: Todas las entidades funcionales y movimientos de inventario procesados.");
}

main()
    .catch((error) => {
        console.error("Error al crear datos iniciales:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });