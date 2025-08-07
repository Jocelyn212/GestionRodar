import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function FilmForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      tipo: 'película',
      urlPoster: 'https://res.cloudinary.com/dvoh9w1ro/image/upload/v1706542878/imagen_generica_bpgzg5.png'
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchFilm()
    }
  }, [id, isEdit])

  const fetchFilm = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/obtenerFilmografia/${id}`)
      const film = response.data
      
      // Llenar el formulario con los datos existentes
      Object.keys(film).forEach(key => {
        if (key !== '_id' && key !== '__v') {
          setValue(key, film[key])
        }
      })
    } catch (error) {
      console.error('Error fetching film:', error)
      alert('Error al cargar la filmografía')
      navigate('/films')
    } finally {
      setLoadingData(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isEdit) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/actualizarFilmografia/${id}`, data)
        if (response.data.success) {
          alert('Filmografía actualizada correctamente')
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/nuevaFilmografia`, data)
        if (response.data.success) {
          alert('Filmografía creada correctamente')
        }
      }
      navigate('/films')
    } catch (error) {
      console.error('Error saving film:', error)
      const message = error.response?.data?.message || 'Error al guardar la filmografía'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Editar Filmografía' : 'Nueva Filmografía'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  {...register('tipo', { required: 'El tipo es requerido' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="película">Película</option>
                  <option value="serie">Serie</option>
                </select>
                {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="number"
                  {...register('fecha', { required: 'La fecha es requerida' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="2024"
                />
                {errors.fecha && <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  {...register('duracion')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Poster
                </label>
                <input
                  type="url"
                  {...register('urlPoster')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Títulos */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Títulos</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título (Español) *
                </label>
                <input
                  type="text"
                  {...register('titulo', { required: 'El título es requerido' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título (Inglés)
                </label>
                <input
                  type="text"
                  {...register('tituloEn')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título (Catalán)
                </label>
                <input
                  type="text"
                  {...register('tituloCat')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Sinopsis */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sinopsis</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinopsis (Español) *
                </label>
                <textarea
                  rows={4}
                  {...register('sinopsis', { required: 'La sinopsis es requerida' })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.sinopsis && <p className="mt-1 text-sm text-red-600">{errors.sinopsis.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinopsis (Inglés)
                </label>
                <textarea
                  rows={4}
                  {...register('sinopsisEn')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinopsis (Catalán)
                </label>
                <textarea
                  rows={4}
                  {...register('sinopsisCat')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Género */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Género</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género (Español)
                </label>
                <input
                  type="text"
                  {...register('genero')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Drama, Acción, Comedia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género (Inglés)
                </label>
                <input
                  type="text"
                  {...register('generoEn')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género (Catalán)
                </label>
                <input
                  type="text"
                  {...register('generoCat')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Equipo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director
                </label>
                <input
                  type="text"
                  {...register('director')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guionistas
                </label>
                <input
                  type="text"
                  {...register('guionistas')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Separados por comas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reparto
                </label>
                <input
                  type="text"
                  {...register('reparto')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Separados por comas"
                />
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Enlaces</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link IMDb
                </label>
                <input
                  type="url"
                  {...register('linkImdb')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://www.imdb.com/title/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL YouTube
                </label>
                <input
                  type="url"
                  {...register('urlYoutube')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Making Of
                </label>
                <input
                  type="url"
                  {...register('urlMakingOf')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataformas
                </label>
                <input
                  type="text"
                  {...register('plataformas')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Netflix, Amazon Prime, HBO..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/films')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FilmForm
