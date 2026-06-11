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

    const categorias = [
        { nombre: "Analgésicos", descripcion: "Medicamentos para el alivio del dolor" },
        { nombre: "Antibióticos", descripcion: "Medicamentos para tratar infecciones bacterianas" },
        { nombre: "Vitaminas", descripcion: "Suplementos vitamínicos y minerales" }
    ];

    for (const cat of categorias) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: { descripcion: cat.descripcion },
            create: { nombre: cat.nombre, descripcion: cat.descripcion },
        });
    }

    const catAnalgesicos = await prisma.categoria.findUnique({ where: { nombre: "Analgésicos" } });
    
    if (catAnalgesicos) {
        const productos = [
            {
                nombre: "Paracetamol 500mg",
                descripcion: "Caja x 100 tabletas",
                codigoBarra: "7701234567890",
                precioCompra: 15.50,
                precioVenta: 25.00,
                stockActual: 100,
                stockMinimo: 20,
                categoriaId: catAnalgesicos.id
            },
            {
                nombre: "Ibuprofeno 400mg",
                descripcion: "Caja x 50 tabletas",
                codigoBarra: "7701234567891",
                precioCompra: 12.00,
                precioVenta: 18.00,
                stockActual: 50,
                stockMinimo: 15,
                categoriaId: catAnalgesicos.id
            }
        ];

        for (const prod of productos) {
            await prisma.producto.upsert({
                where: { codigoBarra: prod.codigoBarra },
                update: { 
                    precioCompra: prod.precioCompra,
                    precioVenta: prod.precioVenta,
                    stockActual: prod.stockActual
                },
                create: { ...prod },
            });
        }
    }

    const clientes = [
        { nombre: "Cliente Mostrador", ciNit: "0", telefono: null, direccion: "S/N", correo: null },
        { nombre: "Farmacia Central", ciNit: "1234567015", telefono: "2223344", direccion: "Av. Principal #123", correo: "contacto@farmaciacentral.com" }
    ];

    for (const cli of clientes) {
        // Al no tener un constraint Unique simple en nombre o NIT (en Prisma no están definidos como @unique en el schema, nombre no es unique en Cliente),
        // no podemos usar upsert directamente por nombre. 
        // Primero buscamos por nombre:
        const existe = await prisma.cliente.findFirst({ where: { nombre: cli.nombre } });
        if (!existe) {
            await prisma.cliente.create({ data: cli });
        }
    }

    const proveedores = [
        { nombre: "Laboratorios Bagó", nit: "987654321", telefono: "3334455", direccion: "Parque Industrial", correo: "ventas@bago.com", contacto: "Carlos Ruiz" },
        { nombre: "Droguería Inti", nit: "112233445", telefono: "3336677", direccion: "Zona Sur", correo: "pedidos@inti.com", contacto: "María Gómez" }
    ];

    for (const prov of proveedores) {
        const existe = await prisma.proveedor.findFirst({ where: { nombre: prov.nombre } });
        if (!existe) {
            await prisma.proveedor.create({ data: prov });
        }
    }

    console.log("Datos de prueba (Categorías, Productos, Clientes, Proveedores) creados correctamente.");
}

main()
    .catch((error) => {
        console.error("Error al crear datos iniciales:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });