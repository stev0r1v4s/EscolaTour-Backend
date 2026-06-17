# 🎓 EscolaTour - Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**EscolaTour Backend** es la API RESTful que alimenta la plataforma EscolaTour, proporcionando endpoints seguros para la gestión de tours educativos, autenticación, reservas, calificaciones y administración de usuarios.

🌐 **API Base URL:** `http://escolat-tur.ds2.eleueleo.com:3000`

📊 **Product Backlog:** [Ver en Google Sheets](https://docs.google.com/spreadsheets/d/1Au4t-Z0DrOhzFgfMqUUxG3pwU429OPF_ArZpA_L2oac/edit?usp=sharing)

---

## 👥 Equipo de Desarrollo

- **Dilan Stiven Rivas Hinestroza** - Scrum Master & Full Stack Developer (Backend & Frontend)
- **Brayan Stiven Ocoro Valois** - Frontend Developer
- **Kelly Dayana Garcia Valencia** - Frontend Developer

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Base de Datos](#-base-de-datos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Sistema de Archivos](#-sistema-de-archivos)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentación Adicional](#-documentación-adicional)

---

## ✨ Características Principales

### Autenticación y Autorización
- 🔐 Sistema JWT con tokens de acceso
- 👤 Roles de usuario (Usuario/Administrador)
- 🛡️ Middleware de autenticación en rutas protegidas
- 🔑 Cambio seguro de contraseña con verificación

### Gestión de Datos
- 🏛️ CRUD completo de destinos educativos
- 📅 Sistema de reservas con cálculo de precios
- ⭐ Sistema de calificaciones y reseñas
- 📱 Gestión de reportes de soporte
- 👥 Administración de usuarios

### Características Avanzadas
- 📁 Sistema de archivos (imágenes, avatares, PDFs)
- 🔍 Búsqueda y paginación eficiente
- 🎨 Gestión de preferencias de usuario (tema, idioma, moneda)
- 📊 Estadísticas y KPIs para dashboard
- 🔄 Gestión de estados de usuarios y reservas

### Optimizaciones
- ⚡ Consultas optimizadas con Prisma
- 💾 Relaciones eficientes en base de datos
- 🗂️ Índices en campos críticos
- 📦 Validación de entrada en todos los endpoints

---

## 🛠️ Tecnologías Utilizadas

### Backend Core
- **Node.js 18.x** - Runtime de JavaScript
- **Express.js 4.21** - Framework web
- **Prisma 6.2** - ORM para base de datos
- **PostgreSQL 14+** - Base de datos relacional

### Autenticación y Seguridad
- **jsonwebtoken** - Generación y verificación de JWT
- **bcryptjs** - Hash de contraseñas
- **cors** - Control de acceso cross-origin
- **helmet** - Headers de seguridad HTTP

### Manejo de Archivos
- **multer** - Upload de archivos multipart/form-data
- **path** - Manejo de rutas de archivos

### Utilidades
- **dotenv** - Variables de entorno
- **nodemon** - Auto-reload en desarrollo

---

## 📦 Requisitos Previos

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **PostgreSQL**: v14 o superior
- **Git**: Para clonar el repositorio

---

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/stev0r1v4s/EscolaTour-Backend.git
cd EscolaTour-Backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar base de datos PostgreSQL:**
```bash
# Crear base de datos
createdb escolatour

# O usando psql
psql -U postgres
CREATE DATABASE escolatour;
```

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=3000

# URL de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/escolatour?schema=public"

# Secret para JWT (cambiar en producción)
JWT_SECRET="tu_secret_super_seguro_aqui_cambialo_en_produccion"

# CORS - URL del frontend
FRONTEND_URL="http://localhost:4200"

# Configuración de uploads (opcional)
MAX_FILE_SIZE=10485760
```

### Configuración de Base de Datos

El archivo `DATABASE_URL` debe seguir el formato:
```
postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BD]?schema=public
```

Ejemplo para desarrollo local:
```
postgresql://postgres:password@localhost:5432/escolatour?schema=public
```

---

## 💻 Desarrollo

### 1. Ejecutar migraciones de base de datos
```bash
npx prisma migrate dev
```

### 2. Sembrar datos de prueba (opcional)
```bash
npm run seed
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Comandos disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Generar cliente de Prisma
npx prisma generate

# Abrir Prisma Studio (GUI para BD)
npx prisma studio

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (⚠️ CUIDADO - Borra todos los datos)
npx prisma migrate reset
```

---

## 🗄️ Base de Datos

### Modelos Principales

#### User (Usuario)
```prisma
model User {
  id                String   @id @default(uuid())
  fullName          String
  username          String   @unique
  email             String   @unique
  password          String
  phone             String?
  city              String?
  avatarUrl         String?
  role              String   @default("Usuario")
  status            String   @default("Activo")
  language          String   @default("es-CO")
  currency          String   @default("COP")
  theme             String   @default("Claro")
  publicProfile     Boolean  @default(true)
  searchHistory     Boolean  @default(true)
  passwordChangedAt DateTime?
  createdAt         DateTime @default(now())
  
  reservations      Reservation[]
  reviews           Review[]
  reports           DestinationReport[]
}
```

#### Destination (Destino)
```prisma
model Destination {
  id          String   @id @default(uuid())
  title       String
  description String
  location    String
  latitude    Float
  longitude   Float
  price       Float
  category    String
  imageUrl    String?
  pdfUrl      String?
  benefits    String[]
  status      String   @default("Borrador")
  createdAt   DateTime @default(now())
  
  reservations Reservation[]
  reviews      Review[]
  reports      DestinationReport[]
}
```

#### Reservation (Reserva)
```prisma
model Reservation {
  id              String      @id @default(uuid())
  userId          String
  destinationId   String
  reservationDate DateTime
  participants    Int
  status          String      @default("Activa")
  createdAt       DateTime    @default(now())
  
  user            User        @relation(fields: [userId], references: [id])
  destination     Destination @relation(fields: [destinationId], references: [id])
}
```

#### Review (Reseña)
```prisma
model Review {
  id            String      @id @default(uuid())
  userId        String
  destinationId String
  rating        Int
  comment       String?
  likes         Int         @default(0)
  dislikes      Int         @default(0)
  createdAt     DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id])
  destination   Destination @relation(fields: [destinationId], references: [id])
  
  @@unique([userId, destinationId])
}
```

#### DestinationReport (Reporte)
```prisma
model DestinationReport {
  id            String      @id @default(uuid())
  userId        String
  destinationId String
  reason        String
  comment       String?
  status        String      @default("Pendiente")
  createdAt     DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id])
  destination   Destination @relation(fields: [destinationId], references: [id])
}
```

### Migraciones

Las migraciones se encuentran en `prisma/migrations/`. Principales migraciones:

- **Initial**: Esquema base con User, Destination, Reservation
- **Add Reviews**: Sistema de calificaciones
- **Add Reports**: Sistema de reportes
- **Add Status**: Campo de estado en destinos
- **Add Preferences**: Preferencias de usuario (idioma, moneda, tema)

---

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── database.js              # Configuración de Prisma Client
├── controllers/
│   ├── auth.controller.js       # Autenticación (login, register)
│   ├── destination.controller.js # Gestión de destinos
│   ├── reservation.controller.js # Gestión de reservas
│   ├── review.controller.js     # Calificaciones y reseñas
│   ├── report.controller.js     # Reportes de soporte
│   └── user.controller.js       # Gestión de usuarios
├── middleware/
│   ├── authenticate.js          # Verificación de JWT
│   └── upload.js                # Configuración de Multer
├── repositories/
│   ├── user.repository.js       # Acceso a datos de usuarios
│   ├── destination.repository.js
│   ├── reservation.repository.js
│   ├── review.repository.js
│   └── report.repository.js
├── routes/
│   ├── auth.routes.js           # Rutas de autenticación
│   ├── destination.routes.js    # Rutas de destinos
│   ├── reservation.routes.js    # Rutas de reservas
│   ├── review.routes.js         # Rutas de reseñas
│   ├── report.routes.js         # Rutas de reportes
│   └── user.routes.js           # Rutas de usuarios
├── services/
│   ├── auth.service.js          # Lógica de autenticación
│   ├── destination.service.js   # Lógica de destinos
│   ├── reservation.service.js   # Lógica de reservas
│   ├── review.service.js        # Lógica de reseñas
│   ├── report.service.js        # Lógica de reportes
│   └── user.service.js          # Lógica de usuarios
├── prisma/
│   └── client.js                # Cliente de Prisma compartido
└── app.js                       # Punto de entrada de la aplicación

prisma/
├── schema.prisma                # Esquema de base de datos
├── migrations/                  # Migraciones versionadas
└── seed.js                      # Datos de prueba

uploads/
├── avatars/                     # Avatares de usuarios
├── images/                      # Imágenes de destinos
└── documents/                   # PDFs de guías pedagógicas
```

---

## 🌐 Endpoints de la API

### Autenticación (`/auth`)

#### POST `/auth/register`
Registrar nuevo usuario
```json
{
  "fullName": "Juan Pérez",
  "username": "juanperez",
  "email": "juan@example.com",
  "password": "password123"
}
```

#### POST `/auth/login`
Iniciar sesión
```json
{
  "username": "juanperez",
  "password": "password123"
}
```
Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "fullName": "Juan Pérez",
    "username": "juanperez",
    "email": "juan@example.com",
    "role": "Usuario"
  }
}
```

#### GET `/auth/me`
Obtener usuario actual (requiere autenticación)

#### POST `/auth/me/change-password`
Cambiar contraseña (requiere autenticación)
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

---

### Destinos (`/destinations`)

#### GET `/destinations`
Listar todos los destinos publicados
- Query params: `page`, `limit`, `category`, `search`

#### GET `/destinations/:id`
Obtener destino por ID

#### POST `/destinations` (Admin)
Crear nuevo destino
```json
{
  "title": "Parque Explora",
  "description": "Centro interactivo...",
  "location": "Medellín, Colombia",
  "latitude": 6.2708,
  "longitude": -75.5644,
  "price": 32000,
  "category": "Ciencia",
  "benefits": ["Transporte", "Guía", "Actividades"],
  "status": "Publicado"
}
```

#### PUT `/destinations/:id` (Admin)
Actualizar destino

#### DELETE `/destinations/:id` (Admin)
Eliminar destino

#### POST `/destinations/:id/image` (Admin)
Subir imagen del destino (multipart/form-data)

#### POST `/destinations/:id/pdf` (Admin)
Subir guía pedagógica (PDF)

---

### Reservas (`/reservations`)

#### GET `/reservations/me`
Obtener reservas del usuario actual

#### GET `/reservations` (Admin)
Obtener todas las reservas
- Query params: `page`, `limit`, `status`

#### POST `/reservations`
Crear nueva reserva
```json
{
  "destinationId": "uuid",
  "reservationDate": "2025-01-15T09:00:00Z",
  "participants": 25
}
```

#### PUT `/reservations/:id`
Editar reserva

#### DELETE `/reservations/:id`
Cancelar reserva

---

### Reseñas (`/reviews`)

#### GET `/reviews/destination/:destinationId`
Obtener reseñas de un destino

#### POST `/reviews`
Crear reseña
```json
{
  "destinationId": "uuid",
  "rating": 5,
  "comment": "Excelente experiencia educativa"
}
```

#### POST `/reviews/:id/like`
Dar like a una reseña

#### POST `/reviews/:id/dislike`
Dar dislike a una reseña

#### DELETE `/reviews/:id`
Eliminar reseña propia

---

### Reportes (`/reports`)

#### GET `/reports` (Admin)
Obtener todos los reportes

#### GET `/reports/destination/:destinationId` (Admin)
Obtener reportes de un destino

#### POST `/reports`
Crear reporte
```json
{
  "destinationId": "uuid",
  "reason": "Información desactualizada",
  "comment": "El precio ha cambiado..."
}
```

#### PUT `/reports/:id/status` (Admin)
Actualizar estado del reporte

---

### Usuarios (`/users`)

#### GET `/users` (Admin)
Listar usuarios
- Query params: `page`, `limit`, `search`, `status`

#### GET `/users/me`
Obtener perfil del usuario actual

#### PATCH `/users/me/profile`
Actualizar perfil
```json
{
  "fullName": "Juan Pérez García",
  "phone": "+57 300 123 4567",
  "city": "Medellín"
}
```

#### POST `/users/me/avatar`
Subir avatar (multipart/form-data)

#### PATCH `/users/me/preferences`
Actualizar preferencias
```json
{
  "language": "en-US",
  "currency": "USD",
  "theme": "Oscuro",
  "publicProfile": false,
  "searchHistory": true
}
```

#### PATCH `/users/:id/status` (Admin)
Cambiar estado de usuario
```json
{
  "status": "Suspendido"
}
```

#### DELETE `/users/me`
Eliminar cuenta propia

---

## 🔒 Autenticación y Seguridad

### JWT (JSON Web Tokens)

Los tokens se generan en el login y contienen:
```json
{
  "userId": "uuid",
  "username": "juanperez",
  "role": "Usuario",
  "iat": 1638360000,
  "exp": 1638446400
}
```

### Middleware de Autenticación

```javascript
// Uso en rutas protegidas
router.get('/protected', authenticate, controller.method);
```

El middleware:
1. Extrae el token del header `Authorization: Bearer <token>`
2. Verifica la validez del token
3. Adjunta el usuario decodificado a `req.user`

### Hash de Contraseñas

- Algoritmo: **bcrypt**
- Salt rounds: **10**
- Las contraseñas nunca se almacenan en texto plano

### CORS

Configurado para permitir requests desde:
- `http://localhost:4200` (desarrollo)
- `http://escolat-tur.ds2.eleueleo.com` (producción)

---

## 📁 Sistema de Archivos

### Configuración de Multer

Carpetas de destino:
- **avatars**: `uploads/avatars/` - Avatares de usuarios (2MB max)
- **images**: `uploads/images/` - Imágenes de destinos (5MB max)
- **documents**: `uploads/documents/` - PDFs de guías (10MB max)

### Tipos de Archivo Permitidos

- **Imágenes**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **Documentos**: `.pdf`

### Estructura de Nombres

Los archivos se guardan con formato:
```
{timestamp}-{randomString}.{extension}
```

Ejemplo: `1638360000-abc123def456.jpg`

---

## 🧪 Testing

### Tests Manuales

Usar herramientas como:
- **Postman**: Colección de endpoints
- **Insomnia**: Cliente REST
- **Thunder Client**: Extensión de VS Code

### Tests de Endpoints Críticos

1. **Registro y Login**
```bash
# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","username":"testuser","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

2. **Obtener Destinos**
```bash
curl http://localhost:3000/destinations
```

3. **Crear Reserva** (requiere token)
```bash
curl -X POST http://localhost:3000/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"destinationId":"uuid","reservationDate":"2025-01-15","participants":20}'
```

---

## 🚢 Deployment

### Preparación para Producción

1. **Actualizar variables de entorno:**
```env
PORT=3000
DATABASE_URL="postgresql://user:pass@db-server:5432/escolatour"
JWT_SECRET="secret_super_seguro_cambiar_en_produccion"
FRONTEND_URL="http://escolat-tur.ds2.eleueleo.com"
NODE_ENV="production"
```

2. **Ejecutar migraciones en producción:**
```bash
npx prisma migrate deploy
```

3. **Generar cliente de Prisma:**
```bash
npx prisma generate
```

4. **Iniciar servidor:**
```bash
npm start
```

### GitHub Actions (CI/CD)

El proyecto está configurado con deployment automático:
- Push a `main` → Build → Deploy
- Verifica conexión a BD
- Ejecuta migraciones
- Reinicia servidor

### Servidor de Producción

- **Host**: `http://escolat-tur.ds2.eleueleo.com:3000`
- **Base de Datos**: PostgreSQL en servidor dedicado
- **Process Manager**: PM2 o systemd

---

## 📚 Documentación Adicional

### Optimizaciones Realizadas

Ver [`OPTIMIZATION_SUMMARY.md`](./OPTIMIZATION_SUMMARY.md) para detalles sobre:
- Optimizaciones de preferencias de usuario
- Integración backend-frontend
- Migraciones de base de datos

### Prisma Studio

Para explorar la base de datos visualmente:
```bash
npx prisma studio
```

Abre en `http://localhost:5555`

### Logs

Los logs del servidor se imprimen en consola. En producción, considera usar:
- **Winston** para logging estructurado
- **Morgan** para logs de HTTP
- **PM2 logs** para gestión de logs

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar DATABASE_URL en .env
# Verificar credenciales y puerto
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill
```

### Error: "Prisma Client not generated"
```bash
# Regenerar cliente
npx prisma generate
```

### Error: "JWT malformed"
- Verificar que el token se envíe en header `Authorization: Bearer <token>`
- Verificar que JWT_SECRET sea el mismo que se usó para generar el token

---

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de un proyecto académico.

- **Repositorio Backend**: [GitHub - EscolaTour-Backend](https://github.com/stev0r1v4s/EscolaTour-Backend)
- **Repositorio Frontend**: [GitHub - Escola-tour_Frontend](https://github.com/stev0r1v4s/Escola-tour_Frontend)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

## 🙏 Agradecimientos

- Prisma team por el excelente ORM
- Express.js community
- PostgreSQL community
- Node.js foundation

---

**Desarrollado con ❤️ por el equipo de EscolaTour**

*Última actualización: Junio 2026*
