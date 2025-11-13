# Solución: Error de Conexión a Base de Datos

## Problema
```
[Nest] 12124  - 13/11/2025, 1:23:24 p. m.   ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
```

## Causas Comunes

1. **Dependencias no instaladas** - Falta ejecutar `npm install`
2. **Base de datos corrupta** - El archivo `unitrack.db` está corrupto
3. **Permisos de archivo** - No hay permisos para crear/escribir la BD
4. **Puerto en uso** - El puerto 3000 está ocupado

## Soluciones

### Opción 1: Reinstalar todo (Recomendado)

```bash
# En la carpeta backend
cd backend

# 1. Eliminar carpetas de caché
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
Remove-Item -Recurse -Force dist

# 2. Eliminar base de datos anterior (si existe)
Remove-Item unitrack.db -ErrorAction SilentlyContinue

# 3. Instalar dependencias
npm install

# 4. Iniciar en modo desarrollo
npm run start:dev
```

### Opción 2: Limpiar solo la BD

Si `npm install` ya pasó, solo limpia la BD:

```bash
cd backend
Remove-Item unitrack.db -ErrorAction SilentlyContinue
npm run start:dev
```

## Verificar que todo está bien

Una vez que se inicie, deberías ver:

```
[Nest] 12345 - 13/11/2025, 1:25:00 p. m.   LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 13/11/2025, 1:25:01 p. m.   LOG [TypeOrmModule] Successfully connected to the database
🚀 UniTrack Backend está ejecutándose en: http://localhost:3000
```

## Si aún no funciona

1. Abre http://localhost:3000/health en el navegador
2. Deberías ver una respuesta JSON
3. Si no, verifica que el puerto no esté en uso:

```bash
netstat -ano | findstr :3000
```

Si hay algo usando el puerto, mátalo o cambia el puerto en `.env`
