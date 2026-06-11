import { prisma } from "@/lib/prisma";
import { EstadoRegistro } from "@/generated/prisma/client";
import { Categoria, CrearCategoriaInput, ActualizarCategoriaInput } from "./types";

export async function obtenerCategorias(): Promise<Categoria[]> {
    return prisma.categoria.findMany({
        orderBy: {
            nombre: 'asc'
        }
    });
}

export async function buscarCategoriaPorNombre(nombre: string): Promise<Categoria | null> {
    return prisma.categoria.findUnique({
        where: {
            nombre
        }
    });
}

export async function buscarCategoriaPorId(id: number): Promise<Categoria | null> {
    return prisma.categoria.findUnique({
        where: {
            id
        }
    });
}

export async function crearCategoria(datos: CrearCategoriaInput): Promise<Categoria> {
    return prisma.categoria.create({
        data: {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || null,
        }
    });
}

export async function actualizarCategoria(datos: ActualizarCategoriaInput): Promise<Categoria> {
    return prisma.categoria.update({
        where: {
            id: datos.id
        },
        data: {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() || null,
        }
    });
}

export async function cambiarEstadoCategoria(id: number, estado: EstadoRegistro): Promise<Categoria> {
    return prisma.categoria.update({
        where: {
            id
        },
        data: {
            estado
        }
    });
}
