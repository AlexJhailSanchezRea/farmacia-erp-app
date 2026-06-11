"use client";

import { useTransition } from "react";
import { logoutAction } from "@/modules/auth/actions";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center w-full gap-2 px-4 py-2 mt-4 text-sm font-medium text-rose-500 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isPending ? "Cerrando..." : "Cerrar sesión"}
        </button>
    );
}
