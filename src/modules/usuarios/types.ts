export interface UsuarioCliente {
    id: number;
    nombre: string;
    correo: string;
    estado: "ACTIVO" | "INACTIVO";
    creadoEn: string;
    rol: {
        id: number;
        nombre: string;
    };
}
