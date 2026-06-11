import "dotenv/config";
import crypto from "crypto";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL no esta configurada en el archivo .env");
}

const adapter = new PrismaPg({
    connectionString: databaseUrl,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Iniciando inyección masiva de datos (Seed)...");

    // 0. Configuración
    await prisma.configuracion.upsert({
        where: { id: 1 },
        update: {},
        create: {
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

    // 1. Roles (4)
    const rolesBase = [
        { nombre: "Administrador", descripcion: "Acceso total al sistema" },
        { nombre: "Vendedor", descripcion: "Acceso a ventas y clientes" },
        { nombre: "Inventario/Farmacia", descripcion: "Acceso a productos y almacén" },
        { nombre: "Contador", descripcion: "Acceso a finanzas y reportes" }
    ];

    for (const r of rolesBase) {
        await prisma.rol.upsert({
            where: { nombre: r.nombre },
            update: { descripcion: r.descripcion },
            create: r,
        });
    }

    // 2. Categorías (12)
    const categoriasBase = [
        { nombre: "Analgésicos", descripcion: "Alivio del dolor" },
        { nombre: "Antibióticos", descripcion: "Infecciones bacterianas" },
        { nombre: "Vitaminas", descripcion: "Suplementos vitamínicos" },
        { nombre: "Primeros auxilios", descripcion: "Material de curación" },
        { nombre: "Equipos médicos", descripcion: "Instrumental y dispositivos" },
        { nombre: "Cuidado personal", descripcion: "Higiene y belleza" },
        { nombre: "Higiene", descripcion: "Cuidado bucal y corporal" },
        { nombre: "Bebés", descripcion: "Pañales y cuidado infantil" },
        { nombre: "Medicamentos", descripcion: "Generales de receta médica" },
        { nombre: "Suplementos", descripcion: "Nutrición deportiva" },
        { nombre: "Dermocosmética", descripcion: "Cuidado de la piel especializado" },
        { nombre: "Maternidad", descripcion: "Embarazo y postparto" }
    ];

    for (const cat of categoriasBase) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: { descripcion: cat.descripcion },
            create: cat,
        });
    }

    // 2.5 Usuarios Demo (4)
    const usuariosDemo = [
        { nombre: "Administrador", correo: "admin@nexaerp.com", pass: "Admin12345", rol: "Administrador" },
        { nombre: "Vendedor", correo: "vendedor@nexaerp.com", pass: "Vendedor12345", rol: "Vendedor" },
        { nombre: "Inventario", correo: "inventario@nexaerp.com", pass: "Inventario12345", rol: "Inventario/Farmacia" },
        { nombre: "Contador", correo: "contador@nexaerp.com", pass: "Contador12345", rol: "Contador" }
    ];

    for (const ud of usuariosDemo) {
        const rolBD = await prisma.rol.findUniqueOrThrow({ where: { nombre: ud.rol } });
        const userBD = await prisma.usuario.findUnique({ where: { correo: ud.correo } });
        if (!userBD) {
            const salt = crypto.randomBytes(16).toString("hex");
            const derivedKey = crypto.scryptSync(ud.pass, salt, 64);
            const hashGuardado = `${salt}:${derivedKey.toString("hex")}`;
            await prisma.usuario.create({
                data: {
                    nombre: ud.nombre,
                    correo: ud.correo,
                    contrasenaHash: hashGuardado,
                    rolId: rolBD.id
                }
            });
            console.log(`Usuario demo creado: ${ud.correo}`);
        } else if (userBD.rolId !== rolBD.id) {
            // Actualizar el rol en caso de que lo hayamos renombrado previamente
            await prisma.usuario.update({
                where: { correo: ud.correo },
                data: { rolId: rolBD.id }
            });
        }
    }

    const categoriasDB = await prisma.categoria.findMany();
    const mapCat = new Map(categoriasDB.map(c => [c.nombre, c.id]));

    // 3. Productos (40) - Normalizados
    // 3. Productos (40) - Normalizados Farmacia
    const productosBase = [
        { nombre: "Paracetamol", concentracion: "500 mg", principioActivo: "Paracetamol", laboratorio: "Inti", presentacion: "Caja x 100", requiereReceta: false, codigoBarra: "770001", precioCompra: 15.00, precioVenta: 20.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Analgésicos") },
        { nombre: "Ibuprofeno", concentracion: "400 mg", principioActivo: "Ibuprofeno", laboratorio: "Bagó", presentacion: "Caja x 50", requiereReceta: false, codigoBarra: "770002", precioCompra: 12.00, precioVenta: 18.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Analgésicos") },
        { nombre: "Diclofenaco", concentracion: "50 mg", principioActivo: "Diclofenaco Sódico", laboratorio: "Cofar", presentacion: "Caja x 50", requiereReceta: true, codigoBarra: "770003", precioCompra: 18.00, precioVenta: 25.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Analgésicos") },
        { nombre: "Amoxicilina", concentracion: "500 mg", principioActivo: "Amoxicilina", laboratorio: "Terbol", presentacion: "Caja x 100", requiereReceta: true, codigoBarra: "770004", precioCompra: 30.00, precioVenta: 45.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Antibióticos") },
        { nombre: "Vitamina C 1000 mg", descripcion: "Frasco x 30", codigoBarra: "770005", precioCompra: 20.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Complejo B", descripcion: "Caja x 30", codigoBarra: "770006", precioCompra: 25.00, precioVenta: 38.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Alcohol medicinal 70", descripcion: "Frasco 1000 ml", codigoBarra: "770007", precioCompra: 10.00, precioVenta: 15.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Agua oxigenada 10 vol", descripcion: "Frasco 120 ml", codigoBarra: "770008", precioCompra: 5.00, precioVenta: 8.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Algodón hidrófilo 100 g", descripcion: "Paquete", codigoBarra: "770009", precioCompra: 6.00, precioVenta: 10.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Gasas estériles 10x10", descripcion: "Sobre x 5 unid", codigoBarra: "770010", precioCompra: 3.00, precioVenta: 5.00, stockActual: 0, stockMinimo: 50, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Termómetro digital", descripcion: "Unidad", codigoBarra: "770011", precioCompra: 20.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Equipos médicos") },
        { nombre: "Tensiómetro digital brazo", descripcion: "Unidad", codigoBarra: "770012", precioCompra: 150.00, precioVenta: 220.00, stockActual: 0, stockMinimo: 2, categoriaId: mapCat.get("Equipos médicos") },
        { nombre: "Mascarillas descartables", descripcion: "Caja x 50 unid", codigoBarra: "770013", precioCompra: 15.00, precioVenta: 25.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Guantes de látex M", descripcion: "Caja x 100 unid", codigoBarra: "770014", precioCompra: 35.00, precioVenta: 50.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Shampoo medicado", descripcion: "Frasco 200 ml", codigoBarra: "770015", precioCompra: 40.00, precioVenta: 60.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Cuidado personal") },
        { nombre: "Jabón antibacterial", descripcion: "Barra 90g", codigoBarra: "770016", precioCompra: 4.00, precioVenta: 7.00, stockActual: 0, stockMinimo: 30, categoriaId: mapCat.get("Higiene") },
        { nombre: "Pañales talla M", descripcion: "Paquete x 40", codigoBarra: "770017", precioCompra: 50.00, precioVenta: 70.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Bebés") },
        { nombre: "Toallitas húmedas", descripcion: "Paquete x 80", codigoBarra: "770018", precioCompra: 12.00, precioVenta: 18.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Bebés") },
        { nombre: "Suero oral sabor fresa", descripcion: "Sobre x 1", codigoBarra: "770019", precioCompra: 2.50, precioVenta: 5.00, stockActual: 0, stockMinimo: 50, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Curitas adhesivas redondas", descripcion: "Caja x 100", codigoBarra: "770020", precioCompra: 8.00, precioVenta: 15.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Primeros auxilios") },
        { nombre: "Aspirina 100 mg", descripcion: "Caja x 100 tabletas", codigoBarra: "770021", precioCompra: 10.00, precioVenta: 16.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Analgésicos") },
        { nombre: "Losartan 50 mg", descripcion: "Caja x 30", codigoBarra: "770022", precioCompra: 22.00, precioVenta: 30.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Loratadina 10 mg", descripcion: "Caja x 20", codigoBarra: "770023", precioCompra: 14.00, precioVenta: 22.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Omeprazol 20 mg", descripcion: "Caja x 30", codigoBarra: "770024", precioCompra: 18.00, precioVenta: 28.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Medicamentos") },
        { nombre: "Crema hidratante urea", descripcion: "Tubo 150 ml", codigoBarra: "770025", precioCompra: 30.00, precioVenta: 45.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Dermocosmética") },
        { nombre: "Vitamina D3 1000 UI", descripcion: "Frasco x 60", codigoBarra: "770026", precioCompra: 40.00, precioVenta: 65.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Vitaminas") },
        { nombre: "Jeringa 5 ml descartable", descripcion: "Unidad", codigoBarra: "770027", precioCompra: 0.50, precioVenta: 1.00, stockActual: 0, stockMinimo: 100, categoriaId: mapCat.get("Equipos médicos") },
        { nombre: "Azitromicina 500 mg", descripcion: "Caja x 3", codigoBarra: "770028", precioCompra: 25.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Antibióticos") },
        { nombre: "Cefalexina 500 mg", descripcion: "Caja x 100", codigoBarra: "770029", precioCompra: 80.00, precioVenta: 120.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Antibióticos") },
        { nombre: "Biberón antigases 250 ml", descripcion: "Unidad", codigoBarra: "770030", precioCompra: 45.00, precioVenta: 70.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Bebés") },
        { nombre: "Proteina Whey 1 kg", descripcion: "Pote sabor chocolate", codigoBarra: "770031", precioCompra: 180.00, precioVenta: 250.00, stockActual: 0, stockMinimo: 3, categoriaId: mapCat.get("Suplementos") },
        { nombre: "Colágeno hidrolizado", descripcion: "Pote 300g", codigoBarra: "770032", precioCompra: 90.00, precioVenta: 130.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Suplementos") },
        { nombre: "Crema antiestrias", descripcion: "Tubo 200 ml", codigoBarra: "770033", precioCompra: 60.00, precioVenta: 85.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Maternidad") },
        { nombre: "Protectores mamarios", descripcion: "Caja x 30", codigoBarra: "770034", precioCompra: 25.00, precioVenta: 35.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Maternidad") },
        { nombre: "Pasta dental sensitive", descripcion: "Tubo 90g", codigoBarra: "770035", precioCompra: 15.00, precioVenta: 22.00, stockActual: 0, stockMinimo: 15, categoriaId: mapCat.get("Higiene") },
        { nombre: "Hilo dental 50m", descripcion: "Unidad", codigoBarra: "770036", precioCompra: 8.00, precioVenta: 12.00, stockActual: 0, stockMinimo: 20, categoriaId: mapCat.get("Higiene") },
        { nombre: "Enjuague bucal zero", descripcion: "Frasco 500ml", codigoBarra: "770037", precioCompra: 22.00, precioVenta: 32.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Higiene") },
        { nombre: "Protector solar FPS 50", descripcion: "Tubo 50 ml", codigoBarra: "770038", precioCompra: 70.00, precioVenta: 110.00, stockActual: 0, stockMinimo: 8, categoriaId: mapCat.get("Dermocosmética") },
        { nombre: "Agua micelar", descripcion: "Frasco 200 ml", codigoBarra: "770039", precioCompra: 35.00, precioVenta: 50.00, stockActual: 0, stockMinimo: 10, categoriaId: mapCat.get("Dermocosmética") },
        { nombre: "Azitromicina 250 mg", descripcion: "Suspensión 15ml", codigoBarra: "770040", precioCompra: 30.00, precioVenta: 45.00, stockActual: 0, stockMinimo: 5, categoriaId: mapCat.get("Antibióticos") },
    ];

    for (const prod of productosBase) {
        if (!prod.categoriaId) continue;
        const nombreReal = prod.nombre;
        
        await prisma.producto.upsert({
            where: { codigoBarra: prod.codigoBarra },
            update: { 
                nombre: nombreReal,
                descripcion: prod.presentacion,
                precioCompra: prod.precioCompra,
                precioVenta: prod.precioVenta,
                stockMinimo: prod.stockMinimo,
                categoriaId: prod.categoriaId,
                principioActivo: prod.principioActivo,
                laboratorio: prod.laboratorio,
                presentacion: prod.presentacion,
                concentracion: prod.concentracion,
                requiereReceta: prod.requiereReceta
            },
            create: { 
                nombre: nombreReal,
                descripcion: prod.presentacion,
                codigoBarra: prod.codigoBarra,
                precioCompra: prod.precioCompra,
                precioVenta: prod.precioVenta,
                stockActual: 0,
                stockMinimo: prod.stockMinimo,
                categoriaId: prod.categoriaId,
                principioActivo: prod.principioActivo,
                laboratorio: prod.laboratorio,
                presentacion: prod.presentacion,
                concentracion: prod.concentracion,
                requiereReceta: prod.requiereReceta
            },
        });
    }

    // 4. Clientes (20)
    const clientesBase = [
        { nombre: "Juan Perez", ciNit: "1234567", telefono: "77711122", correo: "juan@example.com" },
        { nombre: "Maria Gomez", ciNit: "7654321", telefono: "77722233", correo: "maria@example.com" },
        { nombre: "Carlos Rodriguez", ciNit: "5556667", telefono: "77733344", correo: "carlos@example.com" },
        { nombre: "Ana Fernandez", ciNit: "4445556", telefono: "77744455", correo: "ana@example.com" },
        { nombre: "Luis Martinez", ciNit: "3334445", telefono: "77755566", correo: "luis@example.com" },
        { nombre: "Elena Vargas", ciNit: "2223334", telefono: "77766677", correo: "elena@example.com" },
        { nombre: "Roberto Diaz", ciNit: "1112223", telefono: "77777788", correo: "roberto@example.com" },
        { nombre: "Sofia Mendoza", ciNit: "9998887", telefono: "77788899", correo: "sofia@example.com" },
        { nombre: "Miguel Suarez", ciNit: "8887776", telefono: "77799900", correo: "miguel@example.com" },
        { nombre: "Lucia Salazar", ciNit: "7776665", telefono: "77700011", correo: "lucia@example.com" },
        { nombre: "Diego Torres", ciNit: "6665554", telefono: "71122233", correo: "diego@example.com" },
        { nombre: "Valeria Ortiz", ciNit: "5554443", telefono: "72233344", correo: "valeria@example.com" },
        { nombre: "Javier Flores", ciNit: "4443332", telefono: "73344455", correo: "javier@example.com" },
        { nombre: "Camila Rojas", ciNit: "3332221", telefono: "74455566", correo: "camila@example.com" },
        { nombre: "Fernando Castro", ciNit: "2345678", telefono: "75566677", correo: "fernando@example.com" },
        { nombre: "Paola Gutierrez", ciNit: "3456789", telefono: "76677788", correo: "paola@example.com" },
        { nombre: "Andres Morales", ciNit: "4567890", telefono: "78899900", correo: "andres@example.com" },
        { nombre: "Daniela Herrera", ciNit: "5678901", telefono: "79900011", correo: "daniela@example.com" },
        { nombre: "Sergio Rios", ciNit: "6789012", telefono: "70011122", correo: "sergio@example.com" },
        { nombre: "Natalia Silva", ciNit: "7890123", telefono: "70022233", correo: "natalia@example.com" }
    ];

    for (const c of clientesBase) {
        const existe = await prisma.cliente.findFirst({ where: { nombre: c.nombre } });
        if (!existe) {
            await prisma.cliente.create({ data: c });
        } else {
            await prisma.cliente.update({ where: { id: existe.id }, data: c });
        }
    }

    // 5. Proveedores (12)
    const proveedoresBase = [
        { nombre: "Laboratorios Bagó", nit: "1000111000", telefono: "22113344", direccion: "Av. Industrial 123", contacto: "Lic. Bagó" },
        { nombre: "Droguería INTI", nit: "2000222000", telefono: "22224455", direccion: "Calle Central 456", contacto: "Ing. Inti" },
        { nombre: "Corporación COFAR", nit: "3000333000", telefono: "22335566", direccion: "Parque Industrial", contacto: "Sr. Cofar" },
        { nombre: "Farmedical", nit: "4000444000", telefono: "22446677", direccion: "Av. Salud 789", contacto: "Lic. Vargas" },
        { nombre: "Laboratorios Vita", nit: "5000555000", telefono: "22557788", direccion: "Calle 4 Zona Sur", contacto: "Sr. Vita" },
        { nombre: "Laboratorios Terbol", nit: "6000666000", telefono: "22668899", direccion: "Av. Comercial", contacto: "Lic. Terbol" },
        { nombre: "Johnson & Johnson", nit: "7000777000", telefono: "22779900", direccion: "Edificio J&J", contacto: "Gerencia" },
        { nombre: "Kimberly Clark", nit: "8000888000", telefono: "22880011", direccion: "Av. Principal", contacto: "Ventas" },
        { nombre: "P&G", nit: "9000999000", telefono: "22991122", direccion: "Torre P&G", contacto: "Distribución" },
        { nombre: "Nestlé Nutrición", nit: "1001001000", telefono: "22002233", direccion: "Av. Nutrición", contacto: "Soporte" },
        { nombre: "Abbott Laboratories", nit: "2002002000", telefono: "22113355", direccion: "Zona Norte", contacto: "Representante" },
        { nombre: "Roche", nit: "3003003000", telefono: "22224466", direccion: "Calle Sur", contacto: "Ventas Institucionales" }
    ];

    for (const p of proveedoresBase) {
        const existe = await prisma.proveedor.findFirst({ where: { nombre: p.nombre } });
        if (!existe) {
            await prisma.proveedor.create({ data: p });
        } else {
            await prisma.proveedor.update({ where: { id: existe.id }, data: p });
        }
    }

    const proveedoresDB = await prisma.proveedor.findMany();
    const prodsDB = await prisma.producto.findMany();

    // 6. Compras y Movimientos (8 operaciones para crear stock)
    // Fechas de prueba
    const hoy = new Date();
    const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1);
    const vencido = new Date(hoy); vencido.setDate(hoy.getDate() - 10);
    const riesgo30 = new Date(hoy); riesgo30.setDate(hoy.getDate() + 15);
    const riesgo60 = new Date(hoy); riesgo60.setDate(hoy.getDate() + 45);
    const largoPlazo = new Date(hoy); largoPlazo.setFullYear(hoy.getFullYear() + 2);

    if (proveedoresDB.length > 0 && prodsDB.length >= 40) {
        const comprasDePrueba = [
            { numeroCompra: "SEED-COMP-001", proveedor: proveedoresDB[0], detalles: [ 
                { prod: prodsDB[0], cant: 50, lote: "L-VENC-01", v: vencido }, 
                { prod: prodsDB[0], cant: 200, lote: "L-SAFE-01", v: largoPlazo },
                { prod: prodsDB[1], cant: 60, lote: "L-R30-01", v: riesgo30 }, 
                { prod: prodsDB[1], cant: 150, lote: "L-SAFE-02", v: largoPlazo },
                { prod: prodsDB[2], cant: 80, lote: "L-R60-01", v: riesgo60 },
                { prod: prodsDB[2], cant: 100, lote: "L-SAFE-03", v: largoPlazo }
            ] },
            { numeroCompra: "SEED-COMP-002", proveedor: proveedoresDB[1], detalles: [ 
                { prod: prodsDB[3], cant: 40, lote: "L-VENC-02", v: vencido }, 
                { prod: prodsDB[3], cant: 100, lote: "L-SAFE-04", v: largoPlazo },
                { prod: prodsDB[4], cant: 50, lote: "L-R30-02", v: riesgo30 }, 
                { prod: prodsDB[5], cant: 100, lote: "L-SAFE-05", v: largoPlazo } 
            ] },
            { numeroCompra: "SEED-COMP-003", proveedor: proveedoresDB[2], detalles: [ { prod: prodsDB[6], cant: 50, lote: "L-106", v: largoPlazo }, { prod: prodsDB[7], cant: 50, lote: "L-107", v: largoPlazo }, { prod: prodsDB[8], cant: 100, lote: "L-108", v: largoPlazo }, { prod: prodsDB[9], cant: 150, lote: "L-109", v: largoPlazo } ] },
            { numeroCompra: "SEED-COMP-004", proveedor: proveedoresDB[3], detalles: [ { prod: prodsDB[10], cant: 20, lote: "L-110", v: largoPlazo }, { prod: prodsDB[11], cant: 10, lote: "L-111", v: largoPlazo }, { prod: prodsDB[12], cant: 300, lote: "L-112", v: largoPlazo } ] },
            { numeroCompra: "SEED-COMP-005", proveedor: proveedoresDB[4], detalles: [ { prod: prodsDB[13], cant: 200, lote: "L-113", v: largoPlazo }, { prod: prodsDB[14], cant: 50, lote: "L-114", v: largoPlazo }, { prod: prodsDB[15], cant: 100, lote: "L-115", v: largoPlazo } ] },
            { numeroCompra: "SEED-COMP-006", proveedor: proveedoresDB[5], detalles: [ { prod: prodsDB[16], cant: 80, lote: "L-116", v: largoPlazo }, { prod: prodsDB[17], cant: 100, lote: "L-117", v: largoPlazo }, { prod: prodsDB[18], cant: 200, lote: "L-118", v: largoPlazo } ] },
            { numeroCompra: "SEED-COMP-007", proveedor: proveedoresDB[6], detalles: [ { prod: prodsDB[19], cant: 100, lote: "L-119", v: largoPlazo }, { prod: prodsDB[20], cant: 150, lote: "L-120", v: largoPlazo }, { prod: prodsDB[21], cant: 80, lote: "L-121", v: largoPlazo } ] },
            { numeroCompra: "SEED-COMP-008", proveedor: proveedoresDB[7], detalles: [ { prod: prodsDB[22], cant: 50, lote: "L-122", v: largoPlazo }, { prod: prodsDB[23], cant: 100, lote: "L-123", v: largoPlazo }, { prod: prodsDB[24], cant: 40, lote: "L-124", v: largoPlazo }, { prod: prodsDB[25], cant: 60, lote: "L-125", v: largoPlazo } ] },
        ];

        for (const compBase of comprasDePrueba) {
            const existeCompra = await prisma.compra.findFirst({ where: { numeroCompra: compBase.numeroCompra } });
            
            if (!existeCompra) {
                await prisma.$transaction(async (tx) => {
                    let totalCompra = 0;
                    
                    const nuevaCompra = await tx.compra.create({
                        data: {
                            numeroCompra: compBase.numeroCompra,
                            proveedorId: compBase.proveedor.id,
                            observacion: "Compra inicial de semilla",
                            total: 0
                        }
                    });

                    for (const det of compBase.detalles) {
                        const subtotal = det.cant * Number(det.prod.precioCompra);
                        totalCompra += subtotal;

                        await tx.detalleCompra.create({
                            data: {
                                compraId: nuevaCompra.id,
                                productoId: det.prod.id,
                                cantidad: det.cant,
                                precioUnitario: det.prod.precioCompra,
                                subtotal: subtotal
                            }
                        });

                        const prodActual = await tx.producto.findUniqueOrThrow({ where: { id: det.prod.id } });
                        const stockAnterior = prodActual.stockActual;
                        const stockNuevo = stockAnterior + det.cant;

                        const lote = await tx.loteProducto.upsert({
                            where: {
                                productoId_numeroLote: { productoId: det.prod.id, numeroLote: det.lote }
                            },
                            create: {
                                productoId: det.prod.id,
                                numeroLote: det.lote,
                                fechaVencimiento: det.v,
                                stockActual: det.cant,
                                stockInicial: det.cant,
                                precioCompra: det.prod.precioCompra
                            },
                            update: {
                                stockActual: { increment: det.cant },
                                stockInicial: { increment: det.cant }
                            }
                        });

                        await tx.producto.update({
                            where: { id: det.prod.id },
                            data: { stockActual: stockNuevo }
                        });

                        await tx.movimientoInventario.create({
                            data: {
                                tipoMovimiento: "ENTRADA",
                                cantidad: det.cant,
                                stockAnterior: stockAnterior,
                                stockNuevo: stockNuevo,
                                motivo: `Compra Fac. ${compBase.numeroCompra}`,
                                compraId: nuevaCompra.id,
                                productoId: det.prod.id,
                                loteId: lote.id
                            }
                        });
                    }

                    await tx.compra.update({
                        where: { id: nuevaCompra.id },
                        data: { total: totalCompra }
                    });

                    await tx.movimientoCaja.create({
                        data: {
                            tipoMovimiento: "EGRESO",
                            concepto: `Compra Fac. ${compBase.numeroCompra}`,
                            monto: totalCompra,
                            referencia: compBase.proveedor.nombre,
                            compraId: nuevaCompra.id
                        }
                    });
                });
            }
        }
    }

    const clientesDB = await prisma.cliente.findMany();
    // Re-fetch de productos para leer el stock actualizado que dejaron las compras
    const productosParaVenta = await prisma.producto.findMany({ where: { stockActual: { gt: 10 } } });

    // 7. Ventas, Comprobantes y Movimientos (8 operaciones simuladas para descontar stock)
    if (clientesDB.length > 0 && productosParaVenta.length >= 20) {
        const ventasDePrueba = [
            { numeroVenta: "SEED-VEN-001", cliente: clientesDB[0], detalles: [ { prod: productosParaVenta[0], cant: 2 }, { prod: productosParaVenta[1], cant: 1 } ] },
            { numeroVenta: "SEED-VEN-002", cliente: clientesDB[1], detalles: [ { prod: productosParaVenta[2], cant: 5 }, { prod: productosParaVenta[3], cant: 2 } ] },
            { numeroVenta: "SEED-VEN-003", cliente: clientesDB[2], detalles: [ { prod: productosParaVenta[4], cant: 3 }, { prod: productosParaVenta[5], cant: 1 }, { prod: productosParaVenta[6], cant: 4 } ] },
            { numeroVenta: "SEED-VEN-004", cliente: null, detalles: [ { prod: productosParaVenta[7], cant: 2 }, { prod: productosParaVenta[8], cant: 2 } ] },
            { numeroVenta: "SEED-VEN-005", cliente: clientesDB[4], detalles: [ { prod: productosParaVenta[9], cant: 10 }, { prod: productosParaVenta[0], cant: 3 } ] },
            { numeroVenta: "SEED-VEN-006", cliente: clientesDB[5], detalles: [ { prod: productosParaVenta[10], cant: 1 }, { prod: productosParaVenta[11], cant: 5 } ] },
            { numeroVenta: "SEED-VEN-007", cliente: clientesDB[6], detalles: [ { prod: productosParaVenta[12], cant: 2 }, { prod: productosParaVenta[13], cant: 2 }, { prod: productosParaVenta[14], cant: 1 } ] },
            { numeroVenta: "SEED-VEN-008", cliente: null, detalles: [ { prod: productosParaVenta[15], cant: 1 }, { prod: productosParaVenta[16], cant: 3 } ] },
        ];

        for (const ventaBase of ventasDePrueba) {
            const existeVenta = await prisma.venta.findFirst({ where: { numeroVenta: ventaBase.numeroVenta } });
            
            if (!existeVenta) {
                await prisma.$transaction(async (tx) => {
                    let totalVenta = 0;
                    
                    const nuevaVenta = await tx.venta.create({
                        data: {
                            numeroVenta: ventaBase.numeroVenta,
                            clienteId: ventaBase.cliente ? ventaBase.cliente.id : null,
                            observacion: "Venta automática de semilla",
                            total: 0
                        }
                    });

                    for (const det of ventaBase.detalles) {
                        const subtotal = det.cant * Number(det.prod.precioVenta);
                        totalVenta += subtotal;

                        await tx.detalleVenta.create({
                            data: {
                                ventaId: nuevaVenta.id,
                                productoId: det.prod.id,
                                cantidad: det.cant,
                                precioUnitario: det.prod.precioVenta,
                                subtotal: subtotal
                            }
                        });

                        const prodActual = await tx.producto.findUniqueOrThrow({ where: { id: det.prod.id } });
                        const stockAnterior = prodActual.stockActual;
                        const stockNuevo = stockAnterior - det.cant;
                        let cantidadRestante = det.cant;

                        const lotesDisp = await tx.loteProducto.findMany({
                            where: { 
                                productoId: prodActual.id, 
                                stockActual: { gt: 0 },
                                fechaVencimiento: { gt: new Date() } // FEFO real: ignorar vencidos
                            },
                            orderBy: { fechaVencimiento: 'asc' }
                        });

                        const stockValido = lotesDisp.reduce((acc, l) => acc + l.stockActual, 0);
                        if (stockValido < det.cant) {
                            throw new Error(`Stock no vencido insuficiente para vender ${det.prod.nombre}. En seed.`);
                        }

                        await tx.producto.update({
                            where: { id: det.prod.id },
                            data: { stockActual: stockNuevo }
                        });

                        for (const lote of lotesDisp) {
                            if (cantidadRestante <= 0) break;
                            const desc = Math.min(lote.stockActual, cantidadRestante);

                            await tx.loteProducto.update({
                                where: { id: lote.id },
                                data: { stockActual: lote.stockActual - desc }
                            });

                            await tx.movimientoInventario.create({
                                data: {
                                    tipoMovimiento: "SALIDA",
                                    cantidad: desc,
                                    stockAnterior: lote.stockActual,
                                    stockNuevo: lote.stockActual - desc,
                                    motivo: `Venta ${ventaBase.numeroVenta} Lote ${lote.numeroLote}`,
                                    ventaId: nuevaVenta.id,
                                    productoId: det.prod.id,
                                    loteId: lote.id
                                }
                            });
                            cantidadRestante -= desc;
                        }
                    }

                    await tx.venta.update({
                        where: { id: nuevaVenta.id },
                        data: { total: totalVenta }
                    });

                    // Generar Comprobante
                    const ts = new Date().getTime().toString().slice(-5);
                    const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                    const numComprobante = `NV-${ts}-${rnd}`;

                    await tx.comprobante.create({
                        data: {
                            numeroComprobante: numComprobante,
                            tipoComprobante: "NOTA_VENTA",
                            total: totalVenta,
                            clienteNombre: ventaBase.cliente ? ventaBase.cliente.nombre : "Cliente General",
                            ventaId: nuevaVenta.id
                        }
                    });

                    await tx.movimientoCaja.create({
                        data: {
                            tipoMovimiento: "INGRESO",
                            concepto: `Venta Fac. ${ventaBase.numeroVenta}`,
                            monto: totalVenta,
                            referencia: ventaBase.cliente ? ventaBase.cliente.nombre : "Cliente General",
                            ventaId: nuevaVenta.id
                        }
                    });
                });
            }
        }
    }

    // 8. Movimientos de Caja de Ajuste (Manual) e Ingreso Inicial
    const capitalInicial = await prisma.movimientoCaja.findFirst({ where: { referencia: "CAPITAL-INICIAL" } });
    if (!capitalInicial) {
        await prisma.movimientoCaja.create({
            data: {
                tipoMovimiento: "INGRESO",
                concepto: "Apertura de caja",
                monto: 100000.00,
                referencia: "CAPITAL-INICIAL",
                estado: "ACTIVO"
            }
        });
    } else {
        await prisma.movimientoCaja.update({
            where: { id: capitalInicial.id },
            data: {
                monto: 100000.00,
                concepto: "Apertura de caja",
                tipoMovimiento: "INGRESO",
                estado: "ACTIVO"
            }
        });
    }

    const cajaPagoServicios = await prisma.movimientoCaja.findFirst({ where: { referencia: "Pago Luz y Agua" } });
    if (!cajaPagoServicios) {
        await prisma.movimientoCaja.create({
            data: {
                tipoMovimiento: "AJUSTE",
                concepto: "Retiro para pago servicios",
                monto: -150.00,
                referencia: "Pago Luz y Agua",
                estado: "ACTIVO"
            }
        });
    }

    console.log("Seed completado exitosamente: 3 Roles, 12 Categorías, 40 Productos, 20 Clientes, 12 Proveedores, 8 Compras y 8 Ventas procesadas con transacciones y caja.");
}

main()
    .catch((e) => {
        console.error("Error ejecutando el seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });