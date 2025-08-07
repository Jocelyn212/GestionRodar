import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FilmIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    peliculas: 0,
    series: 0,
    recent: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.PROD ? '/api' : import.meta.env.VITE_API_URL
      const response = await axios.get(`${apiUrl}/obtenerFilmografias`)
      const filmografias = response.data
      
      const peliculas = filmografias.filter((f) => f.tipo === "película").length;
      const series = filmografias.filter((f) => f.tipo === "serie").length;
      const recent = filmografias.slice(-5).reverse();

      setStats({
        total: filmografias.length,
        peliculas,
        series,
        recent,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FilmIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Filmografías
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FilmIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Películas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.peliculas}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FilmIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Series
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.series}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <Link
          to="/films/new"
          className="bg-white p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-center">
            <PlusIcon className="h-8 w-8 text-gray-400 mr-3" />
            <span className="text-lg font-medium text-gray-900">
              Agregar Nueva Filmografía
            </span>
          </div>
        </Link>

        <Link
          to="/films"
          className="bg-white p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-center">
            <PencilIcon className="h-8 w-8 text-gray-400 mr-3" />
            <span className="text-lg font-medium text-gray-900">
              Ver Todas las Filmografías
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Films */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Filmografías Recientes
          </h3>
          {stats.recent.length > 0 ? (
            <div className="space-y-3">
              {stats.recent.map((film) => (
                <div
                  key={film._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={film.urlPoster}
                      alt={film.titulo}
                      className="h-12 w-8 object-cover rounded mr-3"
                      onError={(e) => {
                        e.target.src =
                          "https://res.cloudinary.com/dvoh9w1ro/image/upload/v1706542878/imagen_generica_bpgzg5.png";
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {film.titulo}
                      </p>
                      <p className="text-sm text-gray-500">
                        {film.tipo} • {film.fecha}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/films/edit/${film._id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay filmografías disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
