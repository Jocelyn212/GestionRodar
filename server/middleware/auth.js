import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar el token JWT
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token de cookies o header Authorization
    const token = req.cookies.token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-clave-secreta-super-segura');
    
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no válido o inactivo' 
      });
    }

    // Agregar el usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token no válido' 
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Permisos insuficientes' 
      });
    }

    next();
  };
};

// Middleware para verificar si es admin
const requireAdmin = requireRole(['admin']);

// Middleware para verificar si es admin o editor
const requireEditor = requireRole(['admin', 'editor']);

export {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireEditor
};
