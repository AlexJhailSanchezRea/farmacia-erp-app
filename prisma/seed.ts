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

    // 2. Categorías
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

    // Obtener las categorías recién creadas para asignar a productos
    const categoriasDB = await prisma.categoria.findMany();
    const mapCat = new Map(categoriasDB.map(c => [c.nombre, c.id]));

    // 3. Productos (25 ejemplos)
    const productosBase = [
        { nombre: "Paracetamol 500 mg", descripcion: "Caja x 100", codigoBarra: "770001", precioCompra: 15.00, precioVenta: 20.00, stockActual: 100, stockMinimo: 20, categoriaId: mapCat.get("Analgesicos") },
        { nombre: "Ibuprofeno 400 mg", descripcion: "Caja x 50", codigoBarra: "770002", precioCompra: 12.00, precioVenta: 18.00, stockActual: 50, stockMinimo: 15, categoriaId: mapCat.get("Antiinflamatorios") },
        { nombre: "Diclofenaco 50 mg", descripcion: "Caja x 50", codigoBarra: "770003", precioCompra: 18.00, precioVenta: 25.00, stockActual: 40, stockMinimo: 10, categoriaId: mapCat.get("Antiinflamatorios") },
        { nombre: "Amoxicilina 500 mg", descripcion: "Caja x 100", codigoBarra: "770004", precioCompra: 30.00, precioVenta: 45.00, stockActual: 80, stockMinimo: 15, categoriaId: mapCat.get("Antibioticos") },
        { nombre: "Vitamina C 1000 mg", descripcion: "Frasco x 30", codigoBarra: "770005", precioCompra: 20.00, precioVenta: 35.00, stockActual: 60, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Complejo B", descripcion: "Caja x 30", codigoBarra: "770006", precioCompra: 25.00, precioVenta: 38.00, stockActual: 45, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Alcohol medicinal 70", descripcion: "Frasco 1000 ml", codigoBarra: "770007", precioCompra: 10.00, precioVenta: 15.00, stockActual: 120, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Agua oxigenada", descripcion: "Frasco 120 ml", codigoBarra: "770008", precioCompra: 5.00, precioVenta: 8.00, stockActual: 80, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Algodon hidrofilo", descripcion: "Paquete 100g", codigoBarra: "770009", precioCompra: 6.00, precioVenta: 10.00, stockActual: 90, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Gasas esteriles", descripcion: "Sobre x 5 unid", codigoBarra: "770010", precioCompra: 3.00, precioVenta: 5.00, stockActual: 200, stockMinimo: 50, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Termometro digital", descripcion: "Unidad", codigoBarra: "770011", precioCompra: 20.00, precioVenta: 35.00, stockActual: 30, stockMinimo: 5, categoriaId: mapCat.get("Equipos medicos") },
        { nombre: "Tensiometro digital", descripcion: "Unidad de brazo", codigoBarra: "770012", precioCompra: 150.00, precioVenta: 220.00, stockActual: 10, stockMinimo: 2, categoriaId: mapCat.get("Equipos medicos") },
        { nombre: "Mascarillas descartables", descripcion: "Caja x 50 unid", codigoBarra: "770013", precioCompra: 15.00, precioVenta: 25.00, stockActual: 150, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Guantes de latex", descripcion: "Caja x 100 unid", codigoBarra: "770014", precioCompra: 35.00, precioVenta: 50.00, stockActual: 40, stockMinimo: 10, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Shampoo medicado", descripcion: "Frasco 200 ml", codigoBarra: "770015", precioCompra: 40.00, precioVenta: 60.00, stockActual: 25, stockMinimo: 5, categoriaId: mapCat.get("Cuidado personal") },
        { nombre: "Jabon antibacterial", descripcion: "Barra 90g", codigoBarra: "770016", precioCompra: 4.00, precioVenta: 7.00, stockActual: 120, stockMinimo: 30, categoriaId: mapCat.get("Higiene") },
        { nombre: "Panales talla M", descripcion: "Paquete x 40", codigoBarra: "770017", precioCompra: 50.00, precioVenta: 70.00, stockActual: 60, stockMinimo: 15, categoriaId: mapCat.get("Bebes") },
        { nombre: "Toallitas humedas", descripcion: "Paquete x 80", codigoBarra: "770018", precioCompra: 12.00, precioVenta: 18.00, stockActual: 100, stockMinimo: 20, categoriaId: mapCat.get("Bebes") },
        { nombre: "Suero oral", descripcion: "Sobre x 1", codigoBarra: "770019", precioCompra: 2.50, precioVenta: 5.00, stockActual: 300, stockMinimo: 50, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Curitas adhesivas", descripcion: "Caja x 100", codigoBarra: "770020", precioCompra: 8.00, precioVenta: 15.00, stockActual: 80, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Aspirina 100 mg", descripcion: "Caja x 100 tabletas", codigoBarra: "770021", precioCompra: 10.00, precioVenta: 16.00, stockActual: 70, stockMinimo: 15, categoriaId: mapCat.get("Analgesicos") },
        { nombre: "Losartan 50 mg", descripcion: "Caja x 30", codigoBarra: "770022", precioCompra: 22.00, precioVenta: 30.00, stockActual: 45, stockMinimo: 10, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Loratadina 10 mg", descripcion: "Caja x 20", codigoBarra: "770023", precioCompra: 14.00, precioVenta: 22.00, stockActual: 55, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Omeprazol 20 mg", descripcion: "Caja x 30", codigoBarra: "770024", precioCompra: 18.00, precioVenta: 28.00, stockActual: 60, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Crema hidratante", descripcion: "Tubo 150 ml", codigoBarra: "770025", precioCompra: 30.00, precioVenta: 45.00, stockActual: 30, stockMinimo: 10, categoriaId: mapCat.get("Cuidado personal") },
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
                stockActual: prod.stockActual,
                stockMinimo: prod.stockMinimo,
                categoriaId: prod.categoriaId
            },
            create: { ...prod, categoriaId: prod.categoriaId },
        });
    }

    // 4. Clientes (12 ejemplos)
    const clientesBase = [
        { nombre: "Cliente General" },
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
    ];

    for (const cli of clientesBase) {
        const existe = await prisma.cliente.findFirst({ where: { nombre: cli.nombre } });
        if (existe) {
            await prisma.cliente.update({
                where: { id: existe.id },
                data: { nombre: cli.nombre }
            });
        } else {
            await prisma.cliente.create({ data: { nombre: cli.nombre } });
        }
    }

    // 5. Proveedores (8 ejemplos)
    const proveedoresBase = [
        { nombre: "Distribuidora Salud" },
        { nombre: "FarmaProveedor Bolivia" },
        { nombre: "Insumos Medicos del Sur" },
        { nombre: "Laboratorios Andinos" },
        { nombre: "Comercial Biofarma" },
        { nombre: "Drogueria Central" },
        { nombre: "Importadora Medica Nacional" },
        { nombre: "Proveedora San Gabriel" },
    ];

    for (const prov of proveedoresBase) {
        const existe = await prisma.proveedor.findFirst({ where: { nombre: prov.nombre } });
        if (existe) {
            await prisma.proveedor.update({
                where: { id: existe.id },
                data: { nombre: prov.nombre }
            });
        } else {
            await prisma.proveedor.create({ data: { nombre: prov.nombre } });
        }
    }

    console.log("Seed completado: Categorias, Productos, Clientes y Proveedores procesados exitosamente.");
}

main()
    .catch((error) => {
        console.error("Error al crear datos iniciales:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });