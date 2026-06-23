/**
 * Middleware de autenticación JWT
 */

const { verifyToken } = require('../utils/tokenGenerator');

/**
 * Verifica que el token JWT sea válido
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
        message: 'Debes incluir un token en el header Authorization'
      });
    }

    // Extraer token
    const token = authHeader.substring(7);

    // Verificar token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: error.message
    });
  }
};

module.exports = authMiddleware;