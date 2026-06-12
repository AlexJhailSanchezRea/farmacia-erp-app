# Mantenimiento, Backup y Restauración - NexaERP / PharmaERP 360

Este documento contiene las guías técnicas para respaldar y recuperar los datos del sistema, asegurando la continuidad del negocio ante fallos.

## 1. Importancia del Backup
Dado que NexaERP maneja información sensible (caja, inventario, vencimientos farmacéuticos), la pérdida de esta base de datos conlleva impactos contables y operativos. Todo administrador técnico debe agendar respaldos rutinarios de la base de datos PostgreSQL.

## 2. Herramientas Necesarias
- Acceso al terminal del servidor o máquina host.
- Herramientas de PostgreSQL instaladas (`pg_dump` para exportar, `psql` para importar).
- Conocer la URL o credenciales de la base de datos.

## 3. Realizar un Backup Manual
El método más seguro y directo para respaldar la información es ejecutar un volcado (dump) usando `pg_dump`.

1. Abre la terminal de tu sistema.
2. Posiciónate en la carpeta raíz del proyecto y asegúrate de tener una carpeta local llamada `backups` (esta carpeta está ignorada por Git para que no subas datos confidenciales a repositorios públicos).
   ```bash
   mkdir -p backups
   ```
3. Ejecuta el comando de exportación. Reemplaza las variables con tus credenciales reales (usuario, host, puerto y nombre de la BD):
   ```bash
   pg_dump -U [TU_USUARIO] -h [TU_HOST] -p [TU_PUERTO] -d [NOMBRE_BD] -F c -f backups/respaldo_nexa_$(date +%Y%m%d_%H%M%S).dump
   ```
   *(Te solicitará la contraseña del usuario de base de datos).*

## 4. Estrategia de Backup Automático (Recomendada)
Para servidores en producción (Linux), se sugiere automatizar el proceso:
1. Crea un script `.sh` simple que ejecute la orden de `pg_dump`.
2. Incluye en tu script comandos para eliminar respaldos más antiguos a 30 días para no llenar el disco duro.
3. Programa este script en `cron` para que se ejecute todos los días a la medianoche.
   ```bash
   0 0 * * * /ruta/al/script/backup.sh
   ```

## 5. Restauración (Restore) de un Backup
Si ocurre un desastre o requieres migrar el servidor a otra máquina, debes restaurar la estructura y los datos.

**Advertencia:** Restaurar un backup sobreescribirá la información actual de la base de datos de destino.

1. Identifica el archivo `.dump` más reciente y sano en tu carpeta de `/backups`.
2. Asegúrate de tener una base de datos vacía lista para recibir los datos en el nuevo entorno o resetea la actual con extrema precaución.
3. Usa `pg_restore` (si guardaste en formato Custom `-F c`) o `psql` (si guardaste en texto plano `.sql`):
   ```bash
   # Para archivos generados en formato custom (.dump)
   pg_restore -U [TU_USUARIO] -h [TU_HOST] -d [NOMBRE_BD] -1 backups/nombre_del_archivo.dump
   ```

## 6. Consideraciones de Seguridad
- **Ocultación de Variables**: Nunca almacenes scripts de backup en repositorios públicos si tienen "quemadas" o escritas explícitamente las credenciales como contraseñas, URLs y nombres de usuario reales.
- **Backups Off-Site**: Un respaldo guardado dentro del mismo disco duro que aloja la aplicación no sirve ante un fallo catastrófico de disco. Transfiere siempre una copia de la carpeta de respaldos hacia servicios de nube como S3, Google Drive u otro servidor vía SSH/FTP.
- **Confidencialidad**: Los respaldos extraídos contienen las contraseñas encriptadas (Hashes) y datos financieros de la empresa, y por tanto, su archivo `.dump` debe tratarse como información altamente clasificada.
