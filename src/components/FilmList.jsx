import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function FilmList() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const apiUrl = import.meta.env.PROD
        ? "/api"
        : import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/obtenerFilmografias`);
      setFilms(response.data);
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  };


  const deleteFilm = async (id) => {
    console.log("Botón de eliminar clickeado", id);
    const confirmado = window.confirm("¿Estás seguro de que quieres eliminar esta filmografía?");
    console.log("Usuario confirmó:", confirmado);

    if (!confirmado) {
      console.log("❌ Eliminación cancelada. No se hace nada.");
      return;
    }

    try {
      const apiUrl = import.meta.env.PROD ? "/api" : import.meta.env.VITE_API_URL;
      console.log("Eliminando en backend...");
      await axios.delete(`${apiUrl}/eliminarFilmografia/${id}`);
      console.log("Respuesta del backend OK, actualizando estado...");
      setFilms(films.filter((film) => film._id !== id));
      alert("Filmografía eliminada correctamente");
    } catch (error) {
      console.error("Error deleting film:", error);
      alert("Error al eliminar la filmografía");
    }
  };

  const filteredFilms = films.filter((film) => {
    if (filter === "all") return true;
    return film.tipo === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Filmografías</h1>
        <Link
          to="/films/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nueva Filmografía
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex space-x-1">
              {[
                { key: "all", label: "Todas" },
                { key: "película", label: "Películas" },
                { key: "serie", label: "Series" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    filter === option.key
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Films Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredFilms.map((film) => (
          <div
            key={film._id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="aspect-w-3 aspect-h-4">
              <img
                src={film.urlPoster}
                alt={film.titulo}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://res.cloudinary.com/dvoh9w1ro/image/upload/v1706542878/imagen_generica_bpgzg5.png";
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {film.titulo}
              </h3>
              <p className="text-sm text-gray-500">
                {film.tipo} • {film.fecha}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {film.sinopsis}
              </p>

              <div className="mt-4 flex justify-between">
                <div className="flex space-x-2">
                  {film.linkImdb && (
                    <a
                      href={film.linkImdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Ver en IMDb"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/films/edit/${film._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => deleteFilm(film._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFilms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron filmografías</p>
        </div>
      )}
    </div>
  );
}

export default FilmList;
