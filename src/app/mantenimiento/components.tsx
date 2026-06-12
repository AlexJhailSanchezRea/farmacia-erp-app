"use client";

import { useTransition } from "react";
import { auditarIntentoBackupAccion } from "@/modules/mantenimiento/actions";

export function PanelMantenimiento() {
    const [isPending, startTransition] = useTransition();

    const handleAuditar = () => {
        startTransition(async () => {
            await auditarIntentoBackupAccion();
            alert("Acción auditada exitosamente. Asegúrate de ejecutar scripts/backup.bat en tu servidor.");
        });
    };

    return (
        <div className="max-w-4xl mt-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Copia de Seguridad (Backup)</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Debido a políticas de seguridad, las copias de seguridad deben ser ejecutadas desde la consola del servidor usando la herramienta <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">pg_dump</code>. Hemos preparado un script para tu comodidad.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleAuditar}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {isPending ? "Registrando..." : "Registrar Intento de Backup"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
                    <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Instrucciones Manuales</h4>
                    <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        <li>Inicia sesión en el servidor donde está alojado PostgreSQL.</li>
                        <li>Abre una consola o terminal.</li>
                        <li>Ejecuta el script proporcionado ubicado en: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-teal-600 dark:text-teal-400">scripts/backup.bat</code></li>
                        <li>El sistema generará un archivo SQL en la carpeta <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-teal-600 dark:text-teal-400">backups/</code> con un nombre que incluye la fecha actual.</li>
                        <li>Descarga y asegura este archivo fuera del servidor por precaución.</li>
                    </ol>
                </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl p-6">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 text-rose-500 mt-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-md font-bold text-rose-800 dark:text-rose-400">Peligro - Restauración de Datos</h4>
                        <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
                            La restauración de datos desde la web está deshabilitada intencionalmente. Nunca intentes restaurar la base de datos de producción desde el cliente web. La restauración debe hacerse exclusivamente utilizando <code className="bg-rose-100 dark:bg-rose-900/50 px-1 rounded">pg_restore</code> desde el servidor maestro.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
