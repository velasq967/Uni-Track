# 🚀 Instrucciones Paso a Paso para Iniciar UniTrack

## ✅ PREREQUISITOS

- Node.js 18+ instalado
- npm o bun instalado
- Git instalado

## 📋 PASO 1: Limpiar y Preparar el Backend

Abre **PowerShell** en modo Administrador y ejecuta:

```powershell
# Navega a la carpeta del backend
cd "c:\Users\megal\Documents\universidad\Plataformas computacionales\UniTrack\backend"

# Limpia las carpetas anteriores
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item unitrack.db -ErrorAction SilentlyContinue

# Instala dependencias
npm install
```

**Tiempo estimado:** 2-5 minutos (espera a que termine completamente)

## 📋 PASO 2: Iniciar el Backend

En la MISMA terminal (o nueva ventana), ejecuta:

```powershell
cd "c:\Users\megal\Documents\universidad\Plataformas computacionales\UniTrack\backend"
npm run start:dev
```

**Deberías ver algo como:**
```
[Nest] 12345 - 13/11/2025, 1:25:00 p. m.   LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 13/11/2025, 1:25:01 p. m.   LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345 - 13/11/2025, 1:25:01 p. m.   LOG [TypeOrmModule] Successfully connected to the database
🚀 UniTrack Backend está ejecutándose en: http://localhost:3000
```

✅ Si ves esto, **¡El backend está listo!** NO cierres esta ventana.

## 📋 PASO 3: Preparar el Frontend

Abre UNA NUEVA terminal (PowerShell):

```powershell
# Navega a la carpeta del frontend
cd "c:\Users\megal\Documents\universidad\Plataformas computacionales\UniTrack\frontend"

# Limpia carpetas anteriores (opcional pero recomendado)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Instala dependencias
bun install
# Si no tienes bun, usa: npm install
```

**Tiempo estimado:** 2-5 minutos

## 📋 PASO 4: Iniciar el Frontend

En la MISMA terminal:

```powershell
cd "c:\Users\megal\Documents\universidad\Plataformas computacionales\UniTrack\frontend"
bun run dev
# Si usas npm: npm run dev
```

**Deberías ver:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## 📋 PASO 5: Abrir la Aplicación

1. Abre tu navegador
2. Ve a: **http://localhost:5173**
3. ¡La aplicación debería cargar!

## 🧪 PASO 6: Probar Registro

1. Haz clic en "Regístrate"
2. Completa el formulario:
   - **Email:** test@ejemplo.com
   - **Contraseña:** password123
   - **Nombre:** Juan
   - **Apellido:** Pérez
   - (Los demás campos son opcionales)
3. Haz clic en "Registrarse"

**Resultado esperado:**
- ✅ Toast verde: "¡Registro exitoso!"
- ✅ Redirección a Dashboard
- ✅ Dashboard VACÍO (sin cursos por defecto) ← **ESTO ES CORRECTO**

## 🧪 PASO 7: Probar Agregar Curso

1. En el dashboard, haz clic en "Agregar Materia"
2. Completa:
   - **Nombre:** Cálculo Diferencial
   - **Código:** MAT101
   - **Créditos:** 4
3. Haz clic en "Agregar"

**Resultado esperado:**
- ✅ Aparece una tarjeta con el curso
- ✅ Solo ves ESTE curso (no otros usuarios ven esto)

## 🧪 PASO 8: Probar Login

1. Haz clic en "Cerrar sesión" (esquina superior)
2. Aparece formulario de login
3. Ingresa:
   - **Email:** test@ejemplo.com
   - **Contraseña:** password123
4. Haz clic en "Iniciar"

**Resultado esperado:**
- ✅ Vuelves al dashboard
- ✅ Ves el curso que creaste (¡persiste!)

## ⚠️ SI ALGO NO FUNCIONA

### Error: "Unable to connect to the database"
```powershell
# Solución: Limpia y reinicia
Remove-Item "c:\Users\megal\Documents\universidad\Plataformas computacionales\UniTrack\backend\unitrack.db"
npm run start:dev
```

### Error: "Puerto 3000 ya está en uso"
```powershell
# Verifica qué usa el puerto
netstat -ano | findstr :3000

# Si necesitas otro puerto, edita backend\.env:
# PORT=3001
```

### Error: "Port 5173 already in use"
```powershell
# El frontend puede usar otro puerto automáticamente
# Solo verifica la URL en la terminal
```

### El frontend no se conecta al backend
```powershell
# Verifica que frontend\.env tenga:
# VITE_API_URL=http://localhost:3000

# Si no, créalo:
```

## 📌 RESUMEN RÁPIDO

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run start:dev
# Espera a ver: "Successfully connected to the database"

# Terminal 2 - Frontend (mientras el backend corre)
cd frontend
bun install
bun run dev
# Abre: http://localhost:5173
```

## ✅ Checklist Final

- [ ] Backend iniciado en http://localhost:3000
- [ ] Frontend iniciado en http://localhost:5173
- [ ] Puedes acceder al frontend sin errores
- [ ] Registro funciona
- [ ] Dashboard aparece vacío después de registrar
- [ ] Puedes agregar un curso
- [ ] El curso aparece en el dashboard
- [ ] Logout y login funcionan
- [ ] Ves tus cursos después de hacer login

## 🎉 ¡ÉXITO!

Si todo funciona, tu sistema UniTrack está **completamente operativo** y cada usuario tiene su información completamente aislada.
