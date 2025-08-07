import express from 'express';
import Filmografia from '../models/Filmografia.js';
import { authenticateToken, requireEditor } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las filmografías
router.get('/obtenerFilmografias', authenticateToken, async (req, res) => {
    try {
        const filmografias = await Filmografia.find({})
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });

        res.json(filmografias);
    } catch (error) {
        console.error('Error obteniendo filmografías:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener una filmografía por ID
router.get('/obtenerFilmografia/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const filmografia = await Filmografia.findById(id)
            .populate('createdBy', 'username');

        if (!filmografia) {
            return res.status(404).json({
                success: false,
                message: 'Filmografía no encontrada'
            });
        }

        res.json(filmografia);
    } catch (error) {
        console.error('Error obteniendo filmografía:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Crear nueva filmografía
router.post('/nuevaFilmografia', authenticateToken, requireEditor, async (req, res) => {
    try {
        // Verificar si no se proporciona urlPoster o está vacío
        if (!req.body.urlPoster || req.body.urlPoster.trim() === '') {
            req.body.urlPoster = 'https://res.cloudinary.com/dvoh9w1ro/image/upload/v1706542878/imagen_generica_bpgzg5.png';
        }

        // Agregar el usuario que creó la filmografía
        req.body.createdBy = req.user._id;

        console.log('Creando filmografía:', req.body);

        const nuevaFilmografia = new Filmografia(req.body);
        const filmografiaGuardada = await nuevaFilmografia.save();

        // Poblar el campo createdBy antes de devolver
        await filmografiaGuardada.populate('createdBy', 'username');

        console.log('Filmografía creada:', filmografiaGuardada);

        res.status(201).json({
            success: true,
            message: 'Filmografía creada exitosamente',
            data: filmografiaGuardada
        });
    } catch (error) {
        console.error('Error creando filmografía:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de filmografía inválidos',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Actualizar filmografía
router.put('/actualizarFilmografia/:id', authenticateToken, requireEditor, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la filmografía existe
        const filmografiaExistente = await Filmografia.findById(id);

        if (!filmografiaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Filmografía no encontrada'
            });
        }

        console.log('Actualizando filmografía:', req.body);

        const filmografiaActualizada = await Filmografia.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username');

        console.log('Filmografía actualizada:', filmografiaActualizada);

        res.json({
            success: true,
            message: 'Filmografía actualizada exitosamente',
            data: filmografiaActualizada
        });
    } catch (error) {
        console.error('Error actualizando filmografía:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de filmografía inválidos',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Eliminar filmografía
router.delete('/eliminarFilmografia/:id', authenticateToken, requireEditor, async (req, res) => {
    try {
        const { id } = req.params;

        const filmografiaEliminada = await Filmografia.findByIdAndDelete(id);

        if (!filmografiaEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Filmografía no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Filmografía eliminada correctamente'
        });
    } catch (error) {
        console.error('Error eliminando filmografía:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener estadísticas
router.get('/estadisticas', authenticateToken, async (req, res) => {
    try {
        const total = await Filmografia.countDocuments();
        const peliculas = await Filmografia.countDocuments({ tipo: 'película' });
        const series = await Filmografia.countDocuments({ tipo: 'serie' });

        const recientes = await Filmografia.find({})
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            estadisticas: {
                total,
                peliculas,
                series,
                recientes
            }
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

export default router;
