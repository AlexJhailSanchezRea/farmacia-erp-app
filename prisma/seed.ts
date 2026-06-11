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
        {
            nombre: "Administrador",
            descripcion: "Usuario con acceso total al sistema.",
        },
        {
            nombre: "Vendedor",
            descripcion: "Usuario encargado de registrar ventas y consultar productos.",
        },
        {
            nombre: "Encargado de inventario",
            descripcion: "Usuario encargado de compras, stock e inventario.",
        },
    ];

    for (const rol of roles) {
        await prisma.rol.upsert({
            where: {
                nombre: rol.nombre,
            },
            update: {
                descripcion: rol.descripcion,
            },
            create: {
                nombre: rol.nombre,
                descripcion: rol.descripcion,
            },
        });
    }

    console.log("Datos iniciales creados correctamente.");
}

main()
    .catch((error) => {
        console.error("Error al crear datos iniciales:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });