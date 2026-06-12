@echo off
setlocal
chcp 65001 >nul

echo ===================================================
echo   NexaERP / PharmaERP 360 - Backup de Base de Datos
echo ===================================================
echo.

:: Este script requiere tener pg_dump instalado y en el PATH de Windows.
:: De manera predeterminada apuntamos a localhost con las credenciales por defecto,
:: ajusta los parametros segun tu entorno de produccion.

set "DB_USER=postgres"
set "DB_PASS=postgres"
set "DB_HOST=localhost"
set "DB_PORT=5432"
set "DB_NAME=nexa_erp"

:: Formato de fecha para el archivo
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "FILENAME=backup_nexa_%YYYY%%MM%%DD%_%HH%%Min%%Sec%.sql"
set "BACKUP_DIR=..\backups"

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

echo Iniciando copia de seguridad de "%DB_NAME%"...

:: Exportando PGPASSWORD para evitar prompt de consola
set PGPASSWORD=%DB_PASS%

pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -F c -b -v -f "%BACKUP_DIR%\%FILENAME%" %DB_NAME%

if %ERRORLEVEL% equ 0 (
    echo.
    echo [EXITO] Backup guardado en: backups\%FILENAME%
) else (
    echo.
    echo [ERROR] Ocurrio un problema al generar el backup. Verifica las credenciales y que pg_dump este instalado.
)

:: Limpiar password
set PGPASSWORD=
pause
