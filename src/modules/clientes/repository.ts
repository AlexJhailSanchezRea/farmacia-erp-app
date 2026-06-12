import { prisma } from "@/lib/prisma";
import { EstadoRegistro, Cliente } from "@/generated/prisma/client";
import { CrearClienteInput, ActualizarClienteInput, ClienteCliente } from "./types";

// Helper para convertir el Cliente de Prisma a ClienteCliente
// para evitar problemas de hidratación con objetos Date
function mapearCliente(clientePrisma: Cliente): ClienteCliente {
    return {
        id: clientePrisma.id,
        nombre: clientePrisma.nombre,
        ciNit: clientePrisma.ciNit,
        telefono: clientePrisma.telefono,
        direccion: clientePrisma.direccion,
        correo: clientePrisma.correo,
        estado: clientePrisma.estado,
        creadoEn: clientePrisma.creadoEn.toISOString(),
        actualizadoEn: clientePrisma.actualizadoEn.toISOString(),
    };
}

export async function obtenerClientes(q?: string, pagina: number = 1, limite: number = 15): Promise<{ data: ClienteCliente[], total: number, totalPages: number }> {
    const whereClause: import("@/generated/prisma/client").Prisma.ClienteWhereInput = q ? {
        OR: [
            { nombre: { contains: q, mode: 'insensitive' as const } },
            { ciNit: { contains: q, mode: 'insensitive' as const } }
        ]
    } : {};

    const total = await prisma.cliente.count({ where: whereClause });
    const totalPages = Math.ceil(total / limite);

    const clientes = await prisma.cliente.findMany({
        where: whereClause,
        orderBy: {
            nombre: 'asc'
        },
        skip: (pagina - 1) * limite,
        take: limite
    });
    return {
        data: clientes.map(mapearCliente),
        total,
        totalPages
    };
}

export async function buscarClientePorNombre(nombre: string): Promise<ClienteCliente | null> {
    const cliente = await prisma.cliente.findFirst({
        where: { nombre }
    });
    return cliente ? mapearCliente(cliente) : null;
}

export async function buscarClientePorId(id: number): Promise<ClienteCliente | null> {
    const cliente = await prisma.cliente.findUnique({
        where: { id }
    });
    return cliente ? mapearCliente(cliente) : null;
}

export async function crearCliente(datos: CrearClienteInput): Promise<ClienteCliente> {
    const cliente = await prisma.cliente.create({
        data: {
            nombre: datos.nombre.trim(),
            ciNit: datos.ciNit?.trim() || null,
            telefono: datos.telefono?.trim() || null,
            direccion: datos.direccion?.trim() || null,
            correo: datos.correo?.trim() || null,
        }
    });
    return mapearCliente(cliente);
}

export async function actualizarCliente(datos: ActualizarClienteInput): Promise<ClienteCliente> {
    const cliente = await prisma.cliente.update({
        where: { id: datos.id },
        data: {
            nombre: datos.nombre.trim(),
            ciNit: datos.ciNit?.trim() || null,
            telefono: datos.telefono?.trim() || null,
            direccion: datos.direccion?.trim() || null,
            correo: datos.correo?.trim() || null,
        }
    });
    return mapearCliente(cliente);
}

export async function cambiarEstadoCliente(id: number, estado: EstadoRegistro): Promise<ClienteCliente> {
    const cliente = await prisma.cliente.update({
        where: { id },
        data: { estado }
    });
    return mapearCliente(cliente);
}
