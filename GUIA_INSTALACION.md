# UniTrack - Guía de Instalación y Uso

## 📋 Descripción

UniTrack es una plataforma académica personalizada donde cada usuario puede gestionar sus propios cursos, calificaciones y notas. Todo funciona por usuario - cuando alguien se registra, ve su perfil completamente en blanco y va agregando su información conforme lo necesita.

## 🔧 Configuración Inicial

### Backend

1. **Navega a la carpeta del backend:**
```bash
cd backend
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
   - Copia `env.example` a `.env` (ya está hecho)
   - Las variables por defecto están configuradas para desarrollo local

4. **Inicia el servidor:**
```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend

1. **Abre una nueva terminal y navega a la carpeta del frontend:**
```bash
cd frontend
```

2. **Instala las dependencias:**
```bash
bun install
# o si usas npm:
npm install
```

3. **Configura las variables de entorno:**
   - Verifica que `.env` tenga: `VITE_API_URL=http://localhost:3000`

4. **Inicia el servidor de desarrollo:**
```bash
bun run dev
# o si usas npm:
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne)

## 📚 Características Implementadas

### Autenticación
- ✅ Registro de nuevos usuarios
- ✅ Login con JWT
- ✅ Protección de rutas (solo usuarios autenticados pueden acceder)
- ✅ Persistencia de sesión con localStorage

### Gestión de Cursos (por usuario)
- ✅ Crear cursos personales
- ✅ Ver todos tus cursos
- ✅ Editar información del curso
- ✅ Eliminar cursos
- ✅ Filtrar por semestre o año

### Gestión de Calificaciones (por usuario)
- ✅ Agregar calificaciones a cursos
- ✅ Ver promedio por curso
- ✅ Calcular GPA general
- ✅ Soporta calificaciones ponderadas

### Gestión de Notas (por usuario)
- ✅ Crear notas asociadas a cursos
- ✅ Editar notas
- ✅ Eliminar notas
- ✅ Ver notas por curso

## 🔑 Flujo de Uso

1. **Registro**: El usuario se registra con email, contraseña, nombre y apellido
2. **Login**: Accede con sus credenciales
3. **Dashboard vacío**: Al iniciar sesión por primera vez, ve un dashboard sin cursos
4. **Agregar datos**: El usuario agrega sus propios cursos, notas y calificaciones
5. **Privacidad**: Cada usuario solo ve su información

## 🏗️ Estructura de Bases de Datos

### Tablas principales:
- **users**: Información del usuario
- **courses**: Cursos (cada curso pertenece a un usuario)
- **grades**: Calificaciones (cada calificación pertenece a un usuario y un curso)
- **notes**: Notas (cada nota pertenece a un usuario y un curso)

## 🔌 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Cursos
- `GET /courses` - Obtener todos tus cursos
- `POST /courses` - Crear un nuevo curso
- `GET /courses/:id` - Obtener un curso específico
- `PATCH /courses/:id` - Editar un curso
- `DELETE /courses/:id` - Eliminar un curso
- `GET /courses/active` - Obtener cursos activos
- `GET /courses/gpa` - Calcular GPA

### Calificaciones
- `GET /grades` - Obtener todas tus calificaciones
- `POST /grades` - Crear una nueva calificación
- `GET /grades/:id` - Obtener una calificación específica
- `PATCH /grades/:id` - Editar una calificación
- `DELETE /grades/:id` - Eliminar una calificación

### Notas
- `GET /notes` - Obtener todas tus notas
- `POST /notes` - Crear una nueva nota
- `GET /notes/:id` - Obtener una nota específica
- `PATCH /notes/:id` - Editar una nota
- `DELETE /notes/:id` - Eliminar una nota

## 🧪 Prueba la Aplicación

### 1. Registro
```
Email: test@ejemplo.com
Contraseña: password123
Nombre: Juan
Apellido: Pérez
ID Estudiante: 2024001 (opcional)
Universidad: Mi Universidad (opcional)
```

### 2. Agregar Curso
Una vez logueado, haz clic en "Agregar Materia" y completa:
- Nombre: Cálculo Diferencial
- Código: MAT101
- Créditos: 4
- Profesor: Dr. López (opcional)
- Semestre: 2024-1 (opcional)

### 3. El curso aparecerá en el dashboard

## 🚀 Próximas Mejoras

- [ ] Integración con calendario
- [ ] Sistema de notificaciones
- [ ] Exportar reportes
- [ ] Aplicación móvil
- [ ] Base de datos relacional (PostgreSQL)

## ⚠️ Notas Importantes

- Cada usuario ve SOLO su información
- Los datos están almacenados en SQLite (cambiar a PostgreSQL en producción)
- El JWT expira en 24 horas
- Las contraseñas están hasheadas con bcryptjs

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el backend esté corriendo en puerto 3000
2. Verifica que el frontend tenga la URL correcta en `.env`
3. Abre la consola del navegador para ver errores
4. Revisa los logs del backend
