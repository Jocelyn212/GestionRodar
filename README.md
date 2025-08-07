# Gestión de Filmografías

Aplicación web para gestionar una base de datos de filmografías (películas y series) conectada a MongoDB Atlas.

## 🚀 Características

- **Sistema de autenticación** con login/logout
- **Dashboard** con estadísticas y accesos rápidos
- **Lista de filmografías** con filtros por tipo
- **Formularios CRUD** para crear/editar/eliminar filmografías
- **Soporte multiidioma** (Español, Inglés, Catalán)
- **Interfaz moderna** con Tailwind CSS
- **Conexión a MongoDB Atlas**

## 🛠️ Tecnologías

- **Frontend**: React + Vite + JavaScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Database**: MongoDB Atlas

## 📦 Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   
4. Edita el archivo `.env` con tus credenciales de MongoDB Atlas

5. Ejecuta la aplicación:
   ```bash
   pnpm dev
   ```

## 🔑 Credenciales de acceso

- **Usuario**: admin
- **Contraseña**: admin123

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Dashboard.jsx      # Vista principal con estadísticas
│   ├── FilmForm.jsx       # Formulario para crear/editar
│   ├── FilmList.jsx       # Lista de filmografías
│   ├── Layout.jsx         # Layout principal con navegación
│   └── Login.jsx          # Componente de autenticación
├── App.jsx                # Componente principal
└── main.jsx              # Punto de entrada
```

## 🌐 API Endpoints

El frontend se conecta a una API REST separada:

- `GET /api/obtenerFilmografias` - Obtener todas las filmografías
- `GET /api/obtenerFilmografia/:id` - Obtener una filmografía específica
- `POST /api/nuevaFilmografia` - Crear nueva filmografía
- `PUT /api/actualizarFilmografia/:id` - Actualizar filmografía existente
- `DELETE /api/eliminarFilmografia/:id` - Eliminar filmografía

## 📋 Modelo de datos

Cada filmografía incluye:

### Información básica
- Tipo (película/serie)
- Fecha de estreno
- Duración
- URL del poster

### Títulos multiidioma
- Título en español
- Título en inglés
- Título en catalán

### Sinopsis multiidioma
- Sinopsis en español
- Sinopsis en inglés
- Sinopsis en catalán

### Equipo
- Director
- Guionistas
- Reparto

### Enlaces
- Link de IMDb
- URL de YouTube (trailer)
- URL de Making Of
- Plataformas de distribución

## 🚀 Scripts disponibles

- `pnpm dev` - Ejecutar en modo desarrollo
- `pnpm build` - Construir para producción
- `pnpm preview` - Previsualizar build de producción
- `pnpm lint` - Ejecutar ESLint

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://localhost:3001/api
VITE_MONGO_URI=tu_mongo_atlas_uri_aqui
JWT_SECRET=tu_clave_secreta_jwt_aqui
```

**⚠️ IMPORTANTE**: 
- Nunca subas el archivo `.env` a GitHub
- Cambia las credenciales por defecto en producción
- Usa una JWT_SECRET fuerte y única

## 📝 Notas

- Asegúrate de tener tu servidor API corriendo en el puerto 3001
- Las credenciales de MongoDB Atlas están incluidas para demostración
- En producción, usa un sistema de autenticación más robusto
