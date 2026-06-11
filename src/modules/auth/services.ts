import { validarHash, crearSesion, cerrarSesion as authCerrarSesion } from "@/lib/auth";
import { buscarUsuarioPorCorreo } from "./repository";

export async function iniciarSesionService(correo: string, contrasena: string) {
    const usuario = await buscarUsuarioPorCorreo(correo);
    
    if (!usuario) {
        throw new Error("Credenciales inválidas.");
    }

    if (usuario.estado !== "ACTIVO") {
        throw new Error("El usuario se encuentra inactivo. Contacte al administrador.");
    }

    const contrasenaValida = await validarHash(contrasena, usuario.contrasenaHash);
    if (!contrasenaValida) {
        throw new Error("Credenciales inválidas.");
    }

    // Si es válido, creamos la sesión
    await crearSesion(usuario.id);
    
    // Retornamos sin hash de forma manual
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        estado: usuario.estado,
        creadoEn: usuario.creadoEn,
        rolId: usuario.rolId,
        rol: usuario.rol
    };
}

export async function cerrarSesionService() {
    await authCerrarSesion();
}
