import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { PaginaModulo } from "@/components/layout/PaginaModulo";
import { CambiarContrasenaForm } from "./components";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
    const usuario = await obtenerUsuarioAutenticado();
    if (!usuario) {
        redirect("/login");
    }

    return (
        <PaginaModulo 
            modulo="Mi Perfil" 
            titulo="Seguridad y Configuración de Cuenta" 
            descripcion="Administra tu información personal y cambia tu contraseña de acceso de forma segura."
            volverA="/"
        >
            <div className="max-w-2xl mt-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Datos del Usuario</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Nombre</p>
                            <p className="font-medium text-slate-900 dark:text-white">{usuario.nombre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Correo Electrónico</p>
                            <p className="font-medium text-slate-900 dark:text-white">{usuario.correo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Rol</p>
                            <p className="font-medium text-slate-900 dark:text-white">{usuario.rol.nombre}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Estado</p>
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                {usuario.estado}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Cambiar Contraseña</h3>
                    <CambiarContrasenaForm />
                </div>
            </div>
        </PaginaModulo>
    );
}
