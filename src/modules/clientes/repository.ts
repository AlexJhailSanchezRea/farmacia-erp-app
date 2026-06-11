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

export async function obtenerClientes(): Promise<ClienteCliente[]> {
    const clientes = await prisma.cliente.findMany({
        orderBy: {
            nombre: 'asc'
        }
    });
    return clientes.map(mapearCliente);
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
