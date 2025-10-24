# InmoTech API REST

API REST completa para el sistema inmobiliario InmoTech, construida con Node.js, Express, Sequelize y SQL Server.

## Stack Tecnológico

- **Backend:** Node.js 18+, Express 4
- **ORM:** Sequelize 6
- **Base de datos:** SQL Server
- **Autenticación:** JWT (access + refresh tokens)
- **Seguridad:** bcryptjs, Helmet, CORS, Rate Limiting
- **Validación:** Joi
- **Logging:** Winston

## Requisitos Previos

- Node.js 18 o superior
- SQL Server 2019 o superior
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
cd api
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con tus credenciales:
```env
NODE_ENV=production
PORT=5000
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=InmobiliariaDB
DB_USER=sa
DB_PASSWORD=TuPassword123
JWT_SECRET=tu_secret_de_64_caracteres_aqui
JWT_REFRESH_SECRET=otro_secret_de_64_caracteres_diferente
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

4. Ejecutar el schema SQL en tu servidor SQL Server (ver archivo de schema proporcionado)

5. Iniciar el servidor:
```bash
npm start
```

Para desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
api/
├── src/
│   ├── config/          # Configuraciones (DB, JWT, CORS)
│   ├── models/          # Modelos Sequelize
│   ├── controllers/     # Controladores (manejo req/res)
│   ├── services/        # Lógica de negocio
│   ├── validators/      # Esquemas de validación Joi
│   ├── middlewares/     # Auth, validación, rate limit, errores
│   ├── routes/          # Rutas Express
│   ├── utils/           # Utilidades (JWT, logger, helpers)
│   ├── app.js           # Configuración Express
│   └── server.js        # Punto de entrada
├── logs/                # Archivos de log
├── .env                 # Variables de entorno
└── package.json
```

## Endpoints API

### Base URL
```
http://localhost:5000/api/v1
```

### Autenticación (`/auth`)

#### Registro
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "3001234567",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "terminos": true
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "Password123!"
}
```

#### Renovar Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "tu_refresh_token"
}
```

#### Obtener Perfil Actual
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

### Citas (`/citas`)

#### Crear Cita
```http
POST /api/v1/citas
Content-Type: application/json
Authorization: Bearer {access_token} (opcional)

{
  "tipo_documento": "CC",
  "numero_documento": "1234567890",
  "primer_nombre": "Juan",
  "primer_apellido": "Pérez",
  "correo": "juan@example.com",
  "telefono": "3001234567",
  "id_inmueble": 1,
  "fecha_cita": "2025-11-01",
  "hora_inicio": "10:00",
  "hora_fin": "11:00",
  "observaciones": "Interesado en conocer el inmueble"
}
```

#### Listar Citas
```http
GET /api/v1/citas?estado=Solicitada&fecha=2025-11-01
Authorization: Bearer {access_token}
```

#### Buscar Persona (Autocompletar)
```http
GET /api/v1/citas/buscar-persona?tipo_documento=CC&numero_documento=1234567890
Authorization: Bearer {access_token}
```

#### Confirmar Cita (Empleado+)
```http
POST /api/v1/citas/:id/confirmar
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "id_agente_asignado": 5
}
```

#### Cancelar Cita
```http
POST /api/v1/citas/:id/cancelar
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "motivo_cancelacion": "Cliente no disponible"
}
```

#### Reagendar Cita
```http
POST /api/v1/citas/:id/reagendar
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fecha_cita": "2025-11-05",
  "hora_inicio": "14:00",
  "hora_fin": "15:00"
}
```

#### Completar Cita (Empleado+)
```http
POST /api/v1/citas/:id/completar
Authorization: Bearer {access_token}
```

### Inmuebles (`/inmuebles`)

#### Crear Inmueble
```http
POST /api/v1/inmuebles
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "registro_inmobiliario": "REG-001-2025",
  "pais": "Colombia",
  "departamento": "Antioquia",
  "ciudad": "Medellín",
  "direccion": "Calle 10 # 20-30",
  "categoria": "Apartamento",
  "precio_venta": 250000000,
  "area_construida": 80.5,
  "descripcion": "Apartamento moderno con 3 habitaciones"
}
```

#### Listar Inmuebles
```http
GET /api/v1/inmuebles?ciudad=Medellín&precioMin=200000000&precioMax=300000000
```

#### Obtener Inmueble
```http
GET /api/v1/inmuebles/:id
```

#### Verificar Disponibilidad
```http
GET /api/v1/inmuebles/:id/disponibilidad?fecha=2025-11-01
```

### Personas (`/personas`)

#### Buscar Persona
```http
GET /api/v1/personas/buscar?tipo_documento=CC&numero_documento=1234567890
Authorization: Bearer {access_token}
```

#### Obtener Mi Perfil
```http
GET /api/v1/personas/me
Authorization: Bearer {access_token}
```

#### Actualizar Mi Perfil
```http
PATCH /api/v1/personas/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "telefono": "3009876543"
}
```

### Roles (`/roles`)

#### Crear Rol (Super Admin)
```http
POST /api/v1/roles
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "nombre_rol": "Analista",
  "descripcion": "Analista de datos inmobiliarios"
}
```

#### Listar Roles (Admin+)
```http
GET /api/v1/roles
Authorization: Bearer {access_token}
```

#### Asignar Rol (Admin+)
```http
POST /api/v1/roles/:idRol/asignar
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "id_persona": 10
}
```

### Notificaciones (`/notificaciones`)

#### Listar Notificaciones No Leídas
```http
GET /api/v1/notificaciones?idPersona=5
Authorization: Bearer {access_token}
```

#### Marcar como Leída
```http
PATCH /api/v1/notificaciones/:id/leer
Authorization: Bearer {access_token}
```

#### Contador de No Leídas
```http
GET /api/v1/notificaciones/contador
Authorization: Bearer {access_token}
```

### Reportes (`/reportes`)

#### Crear Reporte
```http
POST /api/v1/reportes
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "id_inmueble": 1,
  "tipo_reporte": "Mantenimiento",
  "titulo": "Fuga de agua en baño",
  "descripcion": "Se presenta una fuga en el baño principal",
  "prioridad": "Alta"
}
```

#### Listar Reportes (Empleado+)
```http
GET /api/v1/reportes?estado=Pendiente&prioridad=Alta
Authorization: Bearer {access_token}
```

#### Actualizar Reporte (Empleado+)
```http
PATCH /api/v1/reportes/:id
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "estado": "En progreso"
}
```

## Formato de Respuestas

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "meta": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "correo",
      "message": "El correo ya está registrado"
    }
  ]
}
```

## Seguridad

- **JWT:** Tokens de acceso (1h) y refresh (7d)
- **Bcrypt:** 10 rounds para hash de passwords
- **Helmet:** Headers de seguridad HTTP
- **CORS:** Configurado por dominios permitidos
- **Rate Limiting:**
  - Login: 5 intentos / 15 min
  - Registro: 3 intentos / 1 hora
  - Citas: 20 / hora
  - General: 100 / 15 min
- **Validación:** Joi con sanitización de inputs
- **Transacciones:** Operaciones atómicas en BD

## Roles y Permisos

- **Super Administrador:** Acceso total
- **Administrador:** Gestión de usuarios y roles
- **Empleado:** Gestión de citas y reportes
- **Propietario:** Gestión de inmuebles propios
- **Usuario:** Funcionalidades básicas

## Logging

Los logs se guardan en:
- `logs/error.log` - Solo errores
- `logs/combined.log` - Todos los eventos

## Scripts Disponibles

```bash
npm start       # Iniciar en producción
npm run dev     # Iniciar con nodemon
npm run lint    # Ejecutar ESLint
```

## Notas Importantes

1. El usuario **Super Admin** predeterminado se crea con el schema SQL
   - Email: `admin@inmotech.com`
   - Password: `Admin123!`

2. Los teléfonos que empiezan con 3 y tienen 10 dígitos se formatean automáticamente a `+57 XXX XXX XXXX`

3. Las citas verifican disponibilidad horaria automáticamente antes de crearse

4. Al crear un inmueble, el usuario con rol 'Usuario' es promovido automáticamente a 'Propietario'

5. Las notificaciones se crean automáticamente para ciertas acciones (nueva cita, confirmación, etc.)

## Soporte

Para problemas o preguntas, contactar al equipo de desarrollo de InmoTech.
