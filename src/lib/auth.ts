import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

// ==========================================
// 1. Criptografía Nativa (Contraseñas)
// ==========================================

export async function generarHash(contrasena: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Generar un salt seguro de 16 bytes
        const salt = crypto.randomBytes(16).toString("hex");

        // Usar scrypt (algoritmo recomendado resistente a fuerza bruta)
        crypto.scrypt(contrasena, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            // El formato será: salt:hash
            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
}

export async function validarHash(contrasenaPlana: string, hashGuardado: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const [salt, hashOriginal] = hashGuardado.split(":");
        if (!salt || !hashOriginal) return resolve(false);

        const hashOriginalBuffer = Buffer.from(hashOriginal, "hex");

        crypto.scrypt(contrasenaPlana, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            // Usar timingSafeEqual para evitar ataques de temporización
            const isEqual = crypto.timingSafeEqual(hashOriginalBuffer, derivedKey);
            resolve(isEqual);
        });
    });
}

// ==========================================
// 2. Gestión de Sesiones (Tokens y BD)
// ==========================================

export function generarTokenAleatorio(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function hashearToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function crearSesion(usuarioId: number) {
    const tokenCrudo = generarTokenAleatorio();
    const tokenHash = hashearToken(tokenCrudo);
    
    // La sesión expira en 7 días
    const expiraEn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Guardamos en la base de datos solo el HASH del token
    await prisma.sesionUsuario.create({
        data: {
            tokenHash,
            usuarioId,
            expiraEn
        }
    });

    // Guardamos el token CRUDO en la cookie
    const cookieStore = await cookies();
    cookieStore.set("nexa_session", tokenCrudo, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiraEn
    });
}

export async function cerrarSesion() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("nexa_session")?.value;

    if (sessionId) {
        const tokenHash = hashearToken(sessionId);
        // Invalidar en la base de datos
        await prisma.sesionUsuario.deleteMany({
            where: { tokenHash }
        });
    }

    // Borrar la cookie
    cookieStore.delete("nexa_session");
}

export async function obtenerUsuarioAutenticado() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("nexa_session")?.value;

    if (!sessionId) return null;

    const tokenHash = hashearToken(sessionId);

    // Buscar la sesión válida en BD
    const sesion = await prisma.sesionUsuario.findUnique({
        where: { tokenHash },
        include: {
            usuario: {
                include: { rol: true }
            }
        }
    });

    // Si no existe o ya expiró
    if (!sesion || sesion.expiraEn < new Date()) {
        if (sesion) {
            await prisma.sesionUsuario.delete({ where: { id: sesion.id } });
        }
        return null;
    }

    // Retornamos los datos del usuario sin su contraseña hash
    return {
        id: sesion.usuario.id,
        nombre: sesion.usuario.nombre,
        correo: sesion.usuario.correo,
        estado: sesion.usuario.estado,
        creadoEn: sesion.usuario.creadoEn,
        rolId: sesion.usuario.rolId,
        rol: sesion.usuario.rol
    };
}
