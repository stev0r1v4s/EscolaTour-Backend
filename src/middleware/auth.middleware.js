import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Acceso no autorizado. Token no proporcionado.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, fullName, username, email, role, status }
    
    // Check if user is suspended
    if (req.user.status === 'Suspendido') {
      return res.status(403).json({ 
        message: 'Tu cuenta ha sido suspendida. Contacta al soporte técnico.' 
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Token inválido o expirado.' 
    });
  }
};

/**
 * Middleware to authorize requests based on user roles
 * @param {...string} allowedRoles Roles that have access to the route (e.g. 'Administrador', 'Usuario')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acceso denegado. No tienes permisos para realizar esta acción.' 
      });
    }

    next();
  };
};
