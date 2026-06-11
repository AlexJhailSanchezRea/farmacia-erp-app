import { generarHash } from "@/lib/auth";
import { crearUsuarioDB, actualizarUsuarioDB, cambiarEstadoUsuarioDB } from "./repository";

export async function registrarUsuarioService(data: { nombre: string; correo: string; contrasena?: string; rolId: number }) {
    if (!data.contrasena) {
        throw new Error("La contraseña es requerida para nuevos usuarios.");
    }

    const contrasenaHash = await generarHash(data.contrasena);
    
    await crearUsuarioDB({
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
