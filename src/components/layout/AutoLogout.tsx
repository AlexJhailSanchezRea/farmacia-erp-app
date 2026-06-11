"use client";

import { useEffect } from "react";
import { logoutAction } from "@/modules/auth/actions";

export function AutoLogout() {
    useEffect(() => {
        // Llama a la acción del servidor para limpiar la cookie e ir al login
        logoutAction();
    }, []);

    return null;
}
