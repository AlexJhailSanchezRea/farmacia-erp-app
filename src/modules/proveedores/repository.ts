import { prisma } from "@/lib/prisma";
import { EstadoRegistro, Proveedor } from "@/generated/prisma/client";
import { CrearProveedorInput, ActualizarProveedorInput, ProveedorCliente } from "./types";

// Helper para convertir el Proveedor de Prisma a ProveedorCliente
function mapearProveedor(proveedorPrisma: Proveedor): ProveedorCliente {
    return {
        id: proveedorPrisma.id,
        nombre: proveedorPrisma.nombre,
        nit: proveedorPrisma.nit,
        telefono: proveedorPrisma.telefono,
        direccion: proveedorPrisma.direccion,
        correo: proveedorPrisma.correo,
        contacto: proveedorPrisma.contacto,
        estado: proveedorPrisma.estado,
        creadoEn: proveedorPrisma.creadoEn.toISOString(),
        actualizadoEn: proveedorPrisma.actualizadoEn.toISOString(),
    };
}

export async function obtenerProveedores(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: ProveedorCliente[], total: number, totalPages: number }> {
    const whereClause: import("@/generated/prisma/client").Prisma.ProveedorWhereInput = q ? {
        OR: [
            { nombre: { contains: q, mode: 'insensitive' as const } },
            { nit: { contains: q, mode: 'insensitive' as const } }
        ]
    } : {};

    const total = await prisma.proveedor.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const proveedores = await prisma.proveedor.findMany({
        where: whereClause,
        orderBy: {
            nombre: 'asc'
        },
        skip: (pagina - 1) * limite,
        take: limite
    });
    return {
        data: proveedores.map(mapearProveedor),
        total,
        totalPages
    };
}

export async function buscarProveedorPorNombre(nombre: string): Promise<ProveedorCliente | null> {
    const proveedor = await prisma.proveedor.findFirst({
        where: { nombre }
    });
    return proveedor ? mapearProveedor(proveedor) : null;
}

export async function buscarProveedorPorId(id: number): Promise<ProveedorCliente | null> {
    const proveedor = await prisma.proveedor.findUnique({
        where: { id }
    });
    return proveedor ? mapearProveedor(proveedor) : null;
}

export async function crearProveedor(datos: CrearProveedorInput): Promise<ProveedorCliente> {
    const proveedor = await prisma.proveedor.create({
        data: {
            nombre: datos.nombre.trim(),
            nit: datos.nit?.trim() || null,
            telefono: datos.telefono?.trim() || null,
            direccion: datos.direccion?.trim() || null,
            correo: datos.correo?.trim() || null,
            contacto: datos.contacto?.trim() || null,
        }
    });
    return mapearProveedor(proveedor);
}

export async function actualizarProveedor(datos: ActualizarProveedorInput): Promise<ProveedorCliente> {
    const proveedor = await prisma.proveedor.update({
        where: { id: datos.id },
        data: {
            nombre: datos.nombre.trim(),
            nit: datos.nit?.trim() || null,
            telefono: datos.telefono?.trim() || null,
            direccion: datos.direccion?.trim() || null,
            correo: datos.correo?.trim() || null,
            contacto: datos.contacto?.trim() || null,
        }
    });
    return mapearProveedor(proveedor);
}

export async function cambiarEstadoProveedor(id: number, estado: EstadoRegistro): Promise<ProveedorCliente> {
    const proveedor = await prisma.proveedor.update({
        where: { id },
        data: { estado }
    });
    return mapearProveedor(proveedor);
}
