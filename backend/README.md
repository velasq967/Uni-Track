# Uni-Track

Backend y Frontend de la app UniTrack

---

# UniTrack Backend - Portal Estudiantil Universitario

## Descripción

UniTrack es un portal estudiantil universitario que permite a los estudiantes gestionar sus materias y calificaciones de manera organizada. Este backend está construido con NestJS, TypeORM y SQLite.

## Características

- 🔐 **Autenticación JWT**: Sistema de login y registro seguro  
- 👤 **Gestión de usuarios**: Perfil de estudiante con información académica  
- 📚 **Gestión de materias**: Agregar, editar y organizar cursos por semestre  
- 📊 **Sistema de calificaciones**: Registrar notas con diferentes tipos y pesos  
- 📈 **Cálculo de GPA**: Promedio ponderado automático  
- 🔍 **Filtros avanzados**: Búsqueda por semestre, año, tipo de evaluación  

## Estructura del Proyecto

UniTrack-backend/
├── .env # Variables de entorno (local)
├── env.example # Plantilla de variables de entorno
├── .gitignore # Archivos ignorados por Git
├── package.json # Dependencias y scripts
├── src/
│ ├── app.module.ts # Módulo principal con ConfigModule
│ ├── app.controller.ts # Controlador básico de unitrack
│ ├── app.service.ts # Servicio básico de unitrack
│ ├── main.ts # Punto de entrada con ValidationPipe
│ ├── database/
│ │ └── database.module.ts # Configuración escalable de BD
│ └── modules/
│ ├── auth/ # Módulo de autenticación
│ ├── users/ # Módulo de usuarios
│ ├── courses/ # Módulo de cursos
│ └── grades/ # Módulo de calificaciones
└── unitrack.db # Base de datos SQLite


## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd UniTrack-backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   PORT=3000
   JWT_SECRET=tu_clave_secreta_muy_segura
   DB_DATABASE=unitrack.db
   ```

4. **Ejecutar la aplicación**:
   ```bash
   # Desarrollo
   npm run start:dev
   
   # Producción
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/profile` - Obtener perfil (requiere JWT)

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `PATCH /users/:id/change-password` - Cambiar contraseña
- `GET /users/profile/me` - Obtener perfil propio

### Cursos/Materias
- `POST /courses` - Crear materia
- `GET /courses` - Listar materias del usuario
- `GET /courses/active` - Materias activas
- `GET /courses/gpa` - Calcular GPA
- `GET /courses/:id` - Obtener materia por ID
- `PATCH /courses/:id` - Actualizar materia
- `DELETE /courses/:id` - Eliminar materia

### Calificaciones
- `POST /grades` - Crear calificación
- `GET /grades` - Listar calificaciones del usuario
- `GET /grades/recent` - Calificaciones recientes
- `GET /grades/course/:courseId/average` - Promedio de materia
- `GET /grades/:id` - Obtener calificación por ID
- `PATCH /grades/:id` - Actualizar calificación
- `DELETE /grades/:id` - Eliminar calificación


## Modelos de Datos

### Usuario
```typescript
{
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  university: string;
  major: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Curso/Materia
```typescript
{
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  professor: string;
  semester: string;
  year: string;
  isActive: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Calificación
```typescript
{
  id: number;
  score: number;
  description: string;
  type: string;
  weight: number;
  date: Date;
  comments: string;
  userId: number;
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Tecnologías Utilizadas

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **TypeORM**: ORM para TypeScript y JavaScript
- **SQLite**: Base de datos ligera y portable
- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas
- **class-validator**: Validación de DTOs
- **Passport**: Middleware de autenticación

## Scripts Disponibles

- `npm run start` - Ejecutar aplicación
- `npm run start:dev` - Ejecutar en modo desarrollo con hot-reload
- `npm run start:debug` - Ejecutar en modo debug
- `npm run start:prod` - Ejecutar en modo producción
- `npm run build` - Compilar aplicación
- `npm run format` - Formatear código con Prettier

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.