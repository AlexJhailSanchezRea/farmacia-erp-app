import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { UsuariosManager } from "./components";
import { obtenerUsuarios, obtenerRoles } from "@/modules/usuarios/repository";

export const metadata = {
    title: "Usuarios | NexaERP",
};

export default async function UsuariosPage() {
    const [usuarios, roles] = await Promise.all([
        obtenerUsuarios(),
        obtenerRoles()
    ]);

    return (
        <PaginaModulo 
            titulo="Gestión de Usuarios" 
            descripcion="Administre el acceso al sistema, roles y estados de los usuarios."
        >
            <UsuariosManager usuarios={usuarios} roles={roles} />
        </PaginaModulo>
    );
}
