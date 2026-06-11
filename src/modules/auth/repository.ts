import { prisma } from "@/lib/prisma";

export async function buscarUsuarioPorCorreo(correo: string) {
    return await prisma.usuario.findUnique({
        where: { correo },
        include: { rol: true }
    });
}
