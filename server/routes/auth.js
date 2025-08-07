import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Función para generar JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'tu-clave-secreta-super-segura',
        { expiresIn: '24h' }
    );
};

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar campos requeridos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario (puede ser username o email)
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ],
            isActive: true
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Actualizar último login
        await user.updateLastLogin();

        // Generar token
        const token = generateToken(user._id);

        // Configurar cookie segura
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        res.json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logout exitoso'
    });
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            lastLogin: req.user.lastLogin
        }
    });
});

// Crear usuario (solo admin)
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { username, email, password, role = 'editor' } = req.body;

        // Validar campos requeridos
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email y contraseña son requeridos'
            });
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username o email ya están en uso'
            });
        }

        // Crear nuevo usuario
        const newUser = new User({
            username,
            email,
            password,
            role
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error creando usuario:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de usuario inválidos',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Listar usuarios (solo admin)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

export default router;
