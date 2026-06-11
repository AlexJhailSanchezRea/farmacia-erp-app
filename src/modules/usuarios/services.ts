import { generarHash, validarHash } from "@/lib/auth";
import { crearUsuarioDB, actualizarUsuarioDB, cambiarEstadoUsuarioDB, obtenerUsuarioPorIdDB, actualizarContrasenaDB, invalidarSesionesDB } from "./repository";
import { servicioRegistrarAuditoria } from "@/modules/auditoria/services";

export async function registrarUsuarioService(data: { nombre: string; correo: string; contrasena?: string; rolId: number }) {
    if (!data.contrasena) {
        throw new Error("La contraseña es requerida para nuevos usuarios.");
    }

    const contrasenaHash = await generarHash(data.contrasena);
    
    return await crearUsuarioDB({
        nombre: data.nombre,
        correo: data.correo,
        contrasenaHash,
        rolId: data.rolId
    });
}

export async function editarUsuarioService(id: number, data: { nombre: string; correo: string; contrasena?: string; rolId: number }) {
    const updateData: { nombre: string; correo: string; rolId: number; contrasenaHash?: string } = {
        nombre: data.nombre,
        correo: data.correo,
        rolId: data.rolId
    };

    if (data.contrasena && data.contrasena.trim() !== "") {
        updateData.contrasenaHash = await generarHash(data.contrasena);
    }

    await actualizarUsuarioDB(id, updateData);
}

export async function cambiarEstadoUsuarioService(id: number, estadoActual: "ACTIVO" | "INACTIVO") {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    await cambiarEstadoUsuarioDB(id, nuevoEstado);
}

export async function servicioCambiarContrasena(
    usuarioId: number, 
    usuarioCorreo: string,
    actual: string, 
    nueva: string, 
    sessionIdActual: string
) {
    const usuario = await obtenerUsuarioPorIdDB(usuarioId);
    if (!usuario) throw new Error("Usuario no encontrado.");

    const esValida = await validarHash(actual, usuario.contrasenaHash);
    if (!esValida) {
        throw new Error("La contraseña actual es incorrecta.");
    }

    const nuevoHash = await generarHash(nueva);
    await actualizarContrasenaDB(usuarioId, nuevoHash);
    await invalidarSesionesDB(usuarioId, sessionIdActual);

    await servicioRegistrarAuditoria({
        modulo: "USUARIOS",
        accion: "CAMBIAR_CONTRASENA_PROPIA",
        descripcion: `El usuario cambió su propia contraseña.`,
        entidadId: usuarioId,
        entidad: "Usuario"
    }, { usuarioId, usuarioCorreo, ip: null, userAgent: null });
}

export async function servicioResetearContrasena(
    adminId: number, 
    adminCorreo: string,
    usuarioObjetivoId: number, 
    nuevaClaveTemporal: string
) {
    const usuarioObjetivo = await obtenerUsuarioPorIdDB(usuarioObjetivoId);
    if (!usuarioObjetivo) throw new Error("Usuario a resetear no encontrado.");

    const nuevoHash = await generarHash(nuevaClaveTemporal);
    await actualizarContrasenaDB(usuarioObjetivoId, nuevoHash);
    await invalidarSesionesDB(usuarioObjetivoId);

    await servicioRegistrarAuditoria({
        modulo: "USUARIOS",
        accion: "RESET_CONTRASENA_USUARIO",
        descripcion: `El administrador reseteó la contraseña del usuario ${usuarioObjetivo.correo}.`,
        entidadId: usuarioObjetivoId,
        entidad: "Usuario"
    }, { usuarioId: adminId, usuarioCorreo: adminCorreo, ip: null, userAgent: null });
}
