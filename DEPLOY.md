# Guía de Despliegue (Deploy) - NexaERP / PharmaERP 360

Este documento detalla los pasos y requisitos técnicos para migrar el sistema de un entorno de desarrollo local hacia un entorno de producción real en un servidor.

## 1. Requisitos del Servidor
Para un rendimiento óptimo de NexaERP, se recomienda un servidor Privado Virtual (VPS) con las siguientes características base:
- **Sistema Operativo**: Ubuntu 22.04 LTS o superior.
- **CPU**: 2 Cores dedicados o virtuales.
- **Memoria RAM**: 4 GB Mínimo.
- **Almacenamiento**: 40 GB NVMe/SSD (o superior según el volumen de facturas esperadas).
- **Red**: IP Pública estática.

## 2. PostgreSQL en Producción
A diferencia del entorno local, la base de datos de producción debe ser instalada y securizada en el VPS o consumida desde un proveedor de Database as a Service (DBaaS) como AWS RDS o Supabase.
- Configurar el firewall (`ufw`) para permitir acceso externo **solo si es estrictamente necesario**, idealmente permitiendo solo a `localhost` o a la IP del servidor Node.
- Crear un usuario exclusivo en la BD para la aplicación (evitar usar el súper-usuario `postgres` en la URL de conexión).

## 3. Variables de Entorno Seguras
En el entorno de producción debes recrear el archivo `.env`. Bajo ningún motivo los valores reales deben ser incluidos en repositorios públicos.
```bash
# Ejemplo de variables requeridas en el VPS
DATABASE_URL="postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BD]?schema=public"
JWT_SECRET="una_clave_larga_criptografica_generada_con_openssl"
NODE_ENV="production"
```

## 4. Construcción (Build)
1. Clona el repositorio en tu servidor.
2. Ejecuta la instalación limpia de dependencias:
   ```bash
   npm ci
   ```
3. Genera la build optimizada de Next.js:
   ```bash
   npm run build
   ```

## 5. Migración en Producción
En desarrollo sueles usar `npx prisma migrate dev`, pero en producción **NUNCA** debes usar ese comando ya que puede resetear la base de datos de forma destructiva si detecta un desajuste.

Para aplicar cambios de la base de datos a producción, utiliza:
```bash
npx prisma migrate deploy
```
*Si la BD está recién creada en producción, puedes ejecutar el seed (`npx tsx prisma/seed.ts`) para inyectar los roles, configuración base y el primer usuario Administrador.*

Luego, genera el cliente de Prisma adaptado al entorno de tu servidor:
```bash
npx prisma generate
```

## 6. Configuración de Dominio y HTTPS
- Se requiere arrancar la aplicación Next.js mediante un manejador de procesos de Node.js como **PM2**:
  ```bash
  pm2 start npm --name "nexa-erp" -- start
  ```
- No se recomienda exponer el puerto 3000 directo a internet. En su lugar, usa un Reverse Proxy (como **Nginx** o **Caddy**) para enrutar el tráfico del puerto 80/443 hacia el puerto local de Node.js.
- Instala certificados SSL mediante **Certbot (Let's Encrypt)** para garantizar comunicación cifrada HTTPS. Sin HTTPS, el login por contraseñas es extremadamente vulnerable.

## 7. Políticas de Backups
Aprovechando la Fase 1 del sistema, configura `cron jobs` en el servidor Linux (Ubuntu) para que el script `pg_dump` extraiga la base de datos diariamente y la aloje en la carpeta `/backups` o, preferiblemente, se envíe automáticamente a un almacenamiento S3 off-site.

## 8. Recomendaciones Post-Deploy
- **Cambio de Contraseñas Demo**: Inmediatamente después de aplicar el seed en producción, el Administrador DEBE iniciar sesión y cambiar la clave `Admin12345` por una clave fuerte, y borrar/inhabilitar los usuarios demo que no se utilizarán.
- **Advertencia Fiscal**: Recuerda al cliente que, si bien el sistema emitirá "Facturas" e imprimirá tickets, estos comprobantes son de control interno y no representan un descargo impositivo legal a menos que se programe la integración con la API del fisco pertinente (como el SIAT en Bolivia o el SIN).
