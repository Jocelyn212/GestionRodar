<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrucciones del Proyecto de Gestión de Filmografías

Este es un proyecto React + Vite para gestionar una base de datos de filmografías conectada a MongoDB Atlas.

## Estructura del Proyecto

- **Frontend**: React con Vite, JavaScript, Tailwind CSS
- **Backend**: API REST separada con Express y MongoDB
- **Base de datos**: MongoDB Atlas

## Tecnologías utilizadas

- React Router DOM para navegación
- React Hook Form para formularios
- Axios para peticiones HTTP
- Tailwind CSS para estilos
- Heroicons para iconos

## Modelo de datos

Las filmografías incluyen:

- Información básica: tipo, título, fecha, duración
- Títulos multiidioma (español, inglés, catalán)
- Sinopsis multiidioma
- Géneros multiidioma
- Información del equipo: director, guionistas, reparto
- Enlaces: IMDb, YouTube, Making Of, plataformas

## Componentes principales

- `Login`: Autenticación simple
- `Dashboard`: Vista resumen con estadísticas
- `FilmList`: Lista de filmografías con filtros
- `FilmForm`: Formulario para crear/editar filmografías
- `Layout`: Navegación y estructura común

## API Endpoints

- GET `/api/obtenerFilmografias` - Obtener todas las filmografías
- GET `/api/obtenerFilmografia/:id` - Obtener una filmografía específica
- POST `/api/nuevaFilmografia` - Crear nueva filmografía
- PUT `/api/actualizarFilmografia/:id` - Actualizar filmografía
- DELETE `/api/eliminarFilmografia/:id` - Eliminar filmografía

## Variables de entorno

- `VITE_API_URL`: URL de la API backend
- `VITE_MONGO_URI`: URI de conexión a MongoDB Atlas
