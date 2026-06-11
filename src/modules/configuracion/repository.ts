import { prisma } from "@/lib/prisma";
import { ConfiguracionSistema, ConfiguracionUpdateData } from "./types";
import { Configuracion } from "@/generated/prisma/client";

function mapearConfiguracion(conf: Configuracion): ConfiguracionSistema {
    return {
        id: conf.id,
        nombreComercial: conf.nombreComercial,
        razonSocial: conf.razonSocial,
        nit: conf.nit,
        direccion: conf.direccion,
        telefono: conf.telefono,
        correo: conf.correo,
        ciudad: conf.ciudad,
        mensajeComprobante: conf.mensajeComprobante,
        actualizadoEn: conf.actualizadoEn.toISOString()
    };
}

export async function obtenerConfiguracion(): Promise<ConfiguracionSistema> {
    let conf = await prisma.configuracion.findUnique({
        where: { id: 1 }
    });

    if (!conf) {
        conf = await prisma.configuracion.create({
            data: {
                id: 1,
                nombreComercial: "PharmaERP 360",
                razonSocial: "Farmacia Demo S.R.L.",
                nit: "123456789",
                direccion: "Av. Principal 123, Zona Central",
                telefono: "+591 12345678",
                correo: "info@pharmaerp360.com",
                ciudad: "Ciudad Demo",
                mensajeComprobante: "¡Gracias por su compra! Para devoluciones presente este comprobante."
            }
        });
    }

    return mapearConfiguracion(conf);
}

export async function actualizarConfiguracion(data: ConfiguracionUpdateData): Promise<ConfiguracionSistema> {
    const conf = await prisma.configuracion.upsert({
        where: { id: 1 },
        update: data,
        create: {
            id: 1,
            ...data
        }
    });
    
    return mapearConfiguracion(conf);
}
