import { prisma } from "@/lib/prisma";
import { UsuarioCliente } from "./types";

export async function obtenerUsuarios(): Promise<UsuarioCliente[]> {
    const usuarios = await prisma.usuario.findMany({
        include: { rol: true },
        orderBy: { id: 'asc' }
    });

    return usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre,
        correo: u.correo,
        estado: u.estado,
        creadoEn: u.creadoEn.toISOString(),
        rol: {
            id: u.rol.id,
            nombre: u.rol.nombre
        }
    }));
}

export async function obtenerRoles() {
    return await prisma.rol.findMany({
        where: { estado: "ACTIVO" }
    });
}

export async function crearUsuarioDB(data: { nombre: string; correo: string; contrasenaHash: string; rolId: number }) {
    return await prisma.usuario.create({ data });
}

export async function actualizarUsuarioDB(id: number, data: { nombre: string; correo: string; rolId: number; contrasenaHash?: string }) {
    return await prisma.usuario.update({
        where: { id },
        data
    });
}

export async function cambiarEstadoUsuarioDB(id: number, estado: "ACTIVO" | "INACTIVO") {
    // Si lo inactiva, destruimos todas sus sesiones
    if (estado === "INACTIVO") {
        await prisma.$transaction([
            prisma.sesionUsuario.deleteMany({ where: { usuarioId: id } }),
            prisma.usuario.update({ where: { id }, data: { estado } })
        ]);
    } else {
        await prisma.usuario.update({ where: { id }, data: { estado } });
    }
}
